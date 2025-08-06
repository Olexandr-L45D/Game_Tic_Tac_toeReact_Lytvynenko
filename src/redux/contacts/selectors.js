import { createSelector } from "@reduxjs/toolkit";
import { selectStatusFilter } from "../filters/selectors";

export const selectLoading = (state) => state.contacts.loading;

export const selectFilter = (state) => state.contacts.filter;

export const selectError = (state) => state.contacts.error;

export const selectContacts = (state) => state.contacts.items;
export const selectOutContacts = createSelector([selectContacts, selectStatusFilter], (contacts, filter) => {
    return (contacts.filter(contact => contact.name.toLowerCase().includes(filter.toLowerCase()) || contact.number.includes(filter)))
});

// Ivan.Ivan@mail.com - new registrations