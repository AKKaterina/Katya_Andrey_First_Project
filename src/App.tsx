import Root, {
	loader as rootLoader,
	action as rootAction,
} from "./routes/Root";
import About from "./routes/About";
import EditContact, { action as editAction } from "./routes/Edit";
import Contact, {
	loader as contactLoader,
	action as contactAction,
} from "./routes/Contact";
import { action as destroyAction } from "./routes/Destroy";
import Index from "./routes/Index";
import ErrorPage from "./ErrorPage";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Root />,
		loader: rootLoader,
		action: rootAction,
		errorElement: <ErrorPage />,
		children: [
			{
				errorElement: <ErrorPage />,
				children: [
					{ index: true, element: <Index /> },
					{
						path: "contacts/:contactId",
						element: <Contact />,
						loader: contactLoader,
						action: contactAction,
					},
					{
						path: "contacts/:contactId/edit",
						element: <EditContact />,
						loader: contactLoader,
						action: editAction,
					},
					{
						path: "contacts/:contactId/destroy",
						action: destroyAction,
						errorElement: <div>Oops! There was an error.</div>,
					},
				],
			},
		],
	},
	{
		path: "/about",
		element: <About />,
		errorElement: <ErrorPage />,
	},
]);

const App = () => {
	return (
		<>
			<RouterProvider router={router} />
		</>
	);
};

export default App;
