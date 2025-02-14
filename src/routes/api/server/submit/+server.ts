import { createdUser } from "$routes/api/services/user";
import { redirect, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {
    try {
        const data = await request.json(); // Parse incoming data
        console.log('Received data from API server:', data);

        // Simulate saving data to a database or performing other operations
        // Example:
        // await database.save(data);
        const response = await createdUser(
            data.FirstName,
            data.LastName,
            data.CountryCode,
            data.Phone,
            data.Email,
            data.Username,
            data.Password
        );

        return new Response(
            JSON.stringify({ message: 'Data successfully submitted' }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Error in /submit:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to process data' }),
            { status: 500 }
        );
    }
};
