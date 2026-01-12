const Profile = require("../models/Profile");
const Reaction = require("../models/Reaction");

exports.getProfiles = async ({ userId, page = 1, limit = 5 }) => {
  const skip = (page - 1) * limit;

  // Get profiles except own
  const profiles = await Profile.find({ user: { $ne: userId } })
    .skip(skip)
    .limit(limit)
    .lean();

  const profileIds = profiles.map((p) => p._id);

  // Aggregate likes / dislikes
  const reactions = await Reaction.aggregate([
    { $match: { profile: { $in: profileIds } } },
    {
      $group: {
        _id: { profile: "$profile", type: "$type" },
        count: { $sum: 1 },
      },
    },
  ]);

  // Build counts map
  const countsMap = {};
  reactions.forEach((r) => {
    const pid = r._id.profile.toString();
    if (!countsMap[pid]) {
      countsMap[pid] = { likes: 0, dislikes: 0 };
    }
    countsMap[pid][`${r._id.type}s`] = r.count;
  });

  // Attach counts
  const result = profiles.map((p) => ({
    ...p,
    likes: countsMap[p._id]?.likes || 0,
    dislikes: countsMap[p._id]?.dislikes || 0,
  }));

  const total = await Profile.countDocuments({ user: { $ne: userId } });

  return {
    data: result,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};
