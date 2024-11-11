import { db } from '../../lib/firebase';
import { collection, getDocs, Timestamp } from 'firebase/firestore';
import type { PageServerLoad } from './$types';

export const prerender = true;

interface Project {
    id: string;
    title: string;
    author: string;
    description: string;
    website?: string;
    github?: string;
    date: string; // Date as ISO string for serialization
}

// Define the load function with a PageServerLoad type
export const load: PageServerLoad = async () => {
    try {
        // Fetch data from Firestore
        const querySnapshot = await getDocs(collection(db, "projects"));
        const projects: Project[] = querySnapshot.docs.map(doc => {
            const data = doc.data() as Omit<Project, 'id' | 'date'> & { date: Timestamp | undefined };
            
            // Check if `date` exists to avoid errors
            return {
                id: doc.id,
                ...data,
                date: data.date ? data.date.toDate().toISOString() : new Date().toISOString() // Handle undefined date
            };
        });

        // Sort projects by date in descending order
        projects.sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return dateB - dateA;
        });

        console.log("Fetched projects:", projects); // Debugging log

        // Return the fetched projects
        return { projects };
    } catch (error) {
        console.error("Error loading projects:", error);

        // Return hardcoded test data if there's an error
        return {
            status: 500,
            error: "Failed to fetch projects", // Return error in a structured way
            projects: [
                { id: "1", title: "Test Project", author: "Author", description: "Description", date: new Date().toISOString() },
            ]
        };
    }
};
