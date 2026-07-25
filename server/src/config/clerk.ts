import { clerkClient } from '@clerk/express';

// @clerk/express automatically initializes using CLERK_SECRET_KEY from process.env.
// We re-export clerkClient to provide a single import source if needed.
export { clerkClient };
