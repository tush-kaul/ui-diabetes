import Users from '../models/userSchema.js';
import Account from '../models/accountSchema.js';
import LabHbA1cEntry from '../models/labHbA1cEntrySchema.js';

export async function updateClinicalProfile(userId, clinicalData) {
  const updateFields = {};

  if (clinicalData.mrn !== undefined) updateFields.mrn = clinicalData.mrn;
  if (clinicalData.opd !== undefined) updateFields.opd = clinicalData.opd;
  if (clinicalData.ipd !== undefined) updateFields.ipd = clinicalData.ipd;

  if (clinicalData.emergencyContact !== undefined) updateFields.emergencyContact = clinicalData.emergencyContact;
  if (clinicalData.clinicalStatus !== undefined) updateFields.clinicalStatus = clinicalData.clinicalStatus;
  if (Array.isArray(clinicalData.clinicalFlags)) updateFields.clinicalFlags = clinicalData.clinicalFlags;
  if (clinicalData.clinicalNotes !== undefined) updateFields.clinicalNotes = clinicalData.clinicalNotes;

  return await Users.findByIdAndUpdate(userId, updateFields, { new: true });
}

export async function addHbA1cEntry(userId, entryData) {
  const user = await Users.findById(userId).populate('accountId');
  if (!user) throw new Error('User not found');

  const entry = new LabHbA1cEntry({
    user: userId,
    mobile: user?.accountId?.mobile || null,
    value: entryData.value,
    testDate: entryData.testDate,
    labName: entryData.labName,
    notes: entryData.notes,
    zone: entryData.zone,             // optional; computed if not provided by pre-save
    alertLevel: entryData.alertLevel, // optional; computed if not provided by pre-save
    clinicalReasoning: entryData.clinicalReasoning
  });

  await entry.save();
  return entry;
}

export async function getLatestHbA1c(userId) {
  return await LabHbA1cEntry.findOne({ user: userId })
    .sort({ testDate: -1 })
    .populate('user', 'name age gender mrn opd');
}

export async function getHbA1cHistory(userId, options = {}) {
  const query = { user: userId };
  if (options.startDate) query.testDate = { $gte: options.startDate };
  if (options.endDate) query.testDate = { ...(query.testDate || {}), $lte: options.endDate };

  return await LabHbA1cEntry.find(query)
    .sort({ testDate: -1 })
    .limit(options.limit || 50)
    .populate('user', 'name age gender mrn opd');
}

export async function getPatientsByRiskZone(zone, options = {}) {
  const match = { zone };
  if (options.startDate) match.testDate = { $gte: options.startDate };
  if (options.endDate) match.testDate = { ...(match.testDate || {}), $lte: options.endDate };

  return await LabHbA1cEntry.aggregate([
    { $match: match },
    { $sort: { user: 1, testDate: -1 } },
    { $group: { _id: '$user', latestEntry: { $first: '$$ROOT' } } },
    { $replaceRoot: { newRoot: '$latestEntry' } },
    { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'userDetails' } },
    { $unwind: '$userDetails' },
    { $limit: options.limit || 100 }
  ]);
}

// Find user by phone using Account.mobile (exact match)
export async function findUserByPhone(phoneNumber) {
  const account = await Account.findOne({ mobile: phoneNumber });
  if (!account) return null;
  return await Users.findOne({ accountId: account._id });
}