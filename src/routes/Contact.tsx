import { Form, useLoaderData, useFetcher } from "react-router-dom";
import { getContact, updateContact } from "../index.ts";
import { ContactType, ContactIdType, FavoriteProps } from "../types/type.ts";

export async function action({ request, params }) {
	let formData = await request.formData();
	return updateContact(params.contactId, {
		favorite: formData.get("favorite") === "true",
	});
}

export async function loader({
	params,
}: {
	params: ContactIdType;
}): Promise<{ contacts: Partial<ContactType> }> {
	const contacts = await getContact(params.contactId);
	if (!contacts) throw new Response("", {
		status: 404,
		statusText: "Not Found",
	  });
	return { contacts };
}

export default function Contact() {
	const data = useLoaderData() as {
		contacts: ContactType;
	};
	const { contacts } = data;

	return (
		<div id="contact">
			<div>
				<img
					key={contacts?.avatar}
					src={
						contacts?.avatar ||
						"https://i.pinimg.com/564x/2b/20/20/2b20201c6615ed990008b262cb09350e.jpg"
					}
				/>
			</div>

			<div>
				<h1>
					{contacts?.first || contacts?.last ? (
						<>
							{contacts.first} {contacts.last}
						</>
					) : (
						<i>No Name</i>
					)}{" "}
					<Favorite contact={contacts} />
				</h1>

				{contacts?.twitter && (
					<p>
						<a target="_blank" href={`https://twitter.com/${contacts.twitter}`}>
							{contacts.twitter}
						</a>
					</p>
				)}

				{contacts?.notes && <p>{contacts.notes}</p>}

				<div>
					<Form action="edit">
						<button type="submit">Edit</button>
					</Form>
					<Form
						method="post"
						action="destroy"
						onSubmit={(event) => {
							if (!confirm("Please confirm you want to delete this record.")) {
								event.preventDefault();
							}
						}}
					>
						<button type="submit">Delete</button>
					</Form>
				</div>
			</div>
		</div>
	);
}

function Favorite({ contact }: FavoriteProps): JSX.Element {
	// yes, this is a `let` for later
	const fetcher = useFetcher();
	let favorite = contact?.favorite;
	if (fetcher.formData) {
		favorite = fetcher.formData.get("favorite") === "true";
	  }
	return (
		<fetcher.Form method="post">
			<button
				name="favorite"
				value={favorite ? "false" : "true"}
				aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
			>
				{favorite ? "★" : "☆"}
			</button>
		</fetcher.Form>
	);
}
