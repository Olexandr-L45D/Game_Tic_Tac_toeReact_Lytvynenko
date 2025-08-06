import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { register, logIn, logOut, refreshUser } from './operations';
const initialState = {
    user: {
        name: null,
        email: null,
    },
    token: null,
    isLoggedIn: false,
    isRefreshing: false,
    isError: false,
    isLoading: false,
}
const authSlice = createSlice({
    name: 'auth',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(register.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isLoggedIn = true;
                state.isLoading = false;
            })
            .addCase(logIn.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isLoggedIn = true;
                state.isLoading = false;
            })
            .addCase(logOut.fulfilled, () => {
                return initialState;
            })
            .addCase(refreshUser.pending, (state) => {
                state.isRefreshing = true;
            })
            .addCase(refreshUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isRefreshing = false;
                state.isLoggedIn = true;
            })
            .addCase(refreshUser.rejected, (state) => { state.isRefreshing = false; })
            .addMatcher(isAnyOf(register.pending, logIn.pending), (state) => {
                state.isLoading = true;
            })
            .addMatcher(
                isAnyOf(register.rejected, logIn.rejected),
                (state, action) => {
                    state.isLoading = false;
                    state.isError = action.payload;
                }
            );
    },
});

export const authReducer = authSlice.reducer;

// export const selectContacts = (state) => state.contacts.items;
// export const selectOutContacts = createSelector([selectContacts, selectStatusFilter], (contacts, filter) => {
//     return (contacts.filter(contact => contact.name.toLowerCase().includes(filter.toLowerCase())))
// });
// // створюємо фабрики екшкнів автоматично (нижче slice.actions.....)
// // slice.actions.addContact();
// // slice.actions.deleteContact();
// // slice.actions.selectContacts();
// //export const { addContact, deleteContact } = slice.actions;
// // кореневий редюсер (або редюсер слайсу за дефолтом)
// export default slice.reducer;