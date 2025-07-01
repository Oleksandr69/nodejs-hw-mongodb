import { ContactsCollection } from '../db/models/contact.js';
import { UpdateContactsCollection } from '../db/models/update.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  isFavourite,
  contactType,
  isUserId,
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;
  const contactsQuery = ContactsCollection.find();

  if (isUserId) {
    contactsQuery.where('userId').equals(isUserId);
  }
  if (contactType) {
    contactsQuery.where('contactType').equals(contactType);
  }
  if (isFavourite) {
    contactsQuery.where('isFavourite').equals(isFavourite);
  }

  const contactsCount = await ContactsCollection.find()
    .merge(contactsQuery)
    .countDocuments();
  const contacts = await contactsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();
  // const [contactsCount, contacts] = await Promise.all([
  //   ContactsCollection.find().merge(contactsQuery).countDocuments(),
  //   contactsQuery
  //     .skip(skip)
  //     .limit(limit)
  //     .sort({ [sortBy]: sortOrder })
  //     .exec(),
  // ]);

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async (contactId, isUserId) => {
  const contactsQuery = ContactsCollection.findOne(contactId, isUserId);
  if (isUserId) {
    contactsQuery.where('userId').equals(isUserId);
  }
  const contact = await ContactsCollection.findOne({
    _id: contactId,
    userId: isUserId,
  });
  return contact;
};

export const createContact = async (payload) => {
  const contact = await ContactsCollection.create(payload);
  return contact;
};

export const deleteContact = async (contactId, isUserId) => {
  const contactsQuery = ContactsCollection.findOneAndDelete(
    contactId,
    isUserId,
  );
  if (isUserId) {
    contactsQuery.where('userId').equals(isUserId);
  }
  const contact = await ContactsCollection.findOneAndDelete({
    _id: contactId,
    userId: isUserId,
  });

  return contact;
};

export const updateContact = async (
  contactId,
  isUserId,
  payload,
  options = {},
) => {
  const contactsQuery = ContactsCollection.findOneAndUpdate(
    contactId,
    isUserId,
  );
  if (isUserId) {
    contactsQuery.where('userId').equals(isUserId);
  }
  const rawResult = await UpdateContactsCollection.findOneAndUpdate(
    { _id: contactId, userId: isUserId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};
