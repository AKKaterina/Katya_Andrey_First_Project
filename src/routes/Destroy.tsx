import { redirect } from "react-router-dom";
import { deleteContact } from "../index.ts";
import { ContactIdType } from "../types/type.ts";


export async function action({ params }: {params:ContactIdType}) {
  await deleteContact(params.contactId);
  return redirect("/");
  throw new Error("oh dang!");
}