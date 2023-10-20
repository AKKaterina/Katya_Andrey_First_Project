export interface ContactType {
	id: string;
	first?: string;
	last?: string;
	favorite: boolean;
	avatar?: string,
	twitter?: string,
	notes?: string,
    createdAt?:string,
}

export type Contacts = ContactType[]

export interface FavoriteProps {
	contact: {
		favorite: boolean;
	};
}

export interface Request {
    formData: () => Promise<FormData>;
  }
export interface ContactIdType {
    contactId: string;
	// createdAt?:number,
  }
