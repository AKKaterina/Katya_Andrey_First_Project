import localforage from "localforage";
import { matchSorter } from "match-sorter";
import sortBy from "sort-by";
import { ContactType, ContactIdType } from "./types/type";

// Define the type for the sortBy function
// type SortByFunction<T> = (a: T, b: T) => number;
export async function getContacts(query: string = ""): Promise<ContactType[]> {
	// Assuming fakeNetwork is a function that returns a Promise
	await fakeNetwork(`getContacts:${query}`);

	let contacts: ContactType[] | null = await localforage.getItem<ContactType[]>(
		"contacts"
	);
	if (!contacts) contacts = [];
	if (query) {
		// Assuming matchSorter and sortBy functions are imported and correctly typed
		contacts = matchSorter(contacts, query, { keys: ["first", "last"] });
	}
	return contacts.sort(sortBy("last", "createdAt")) as ContactType[];
}

export async function createContact(): Promise<ContactIdType> {
	try {
		await fakeNetwork();
		let id = Math.random().toString(36).substring(2, 9);
		let contact = { id, createdAt: Date.now() };
		let contacts = await getContacts();
		contacts.unshift(contact);
		await set(contacts);
		return contact;
	} catch (error) {
		throw error;
	}
}

export async function getContact(id: ContactIdType) {
	await fakeNetwork(`contact:${id}`);
	let contacts: ContactType[] | null = await localforage.getItem("contacts");
	if (!contacts) throw new Error("No contact found in DB");
	let contact;
	if (isString(id)) {
		contact = contacts.find((contact) => contact.id === id);
	}
	return contact ?? null;
}

export async function updateContact(id: string, updates: Partial<ContactType>) {
	await fakeNetwork();
	let contacts: ContactType[] | null = await localforage.getItem("contacts");
	if (!contacts) throw new Error("No contact found in DB");
	let contact = contacts.find((contact) => contact.id === id);
	if (!contact) throw new Error("No contact found for" + id);
	Object.assign(contact, updates);
	await set(contacts);
	return contact;
}

export async function deleteContact(id: ContactIdType): Promise<ContactType> {
	let contacts: ContactType[] | null = await localforage.getItem("contacts");
	if (!contacts) throw new Error("No contact found in DB");

	let index;
	if (isString(id)) {
		index = contacts.findIndex((contact) => contact.id === id);
	}
	// let index = contacts.findIndex(contact => contact.id === id);
	if (!index) throw new Error("No contact found in DB");

	if (index > -1) {
		contacts.splice(index, 1);
		await set(contacts);
		return true;
	}
	return false;
}

function set(contacts: ContactType) {
	return localforage.setItem("contacts", contacts);
}

// fake a cache so we don't slow down stuff we've already seen
let fakeCache = {};

async function fakeNetwork(key?: any) {
	if (!key) {
		fakeCache = {};
	}

	if (fakeCache[key]) {
		return;
	}

	fakeCache[key] = true;
	return new Promise((res) => {
		setTimeout(res, Math.random() * 800);
	});
}

function isString(value: any): value is string {
	return typeof value === "string";
}
