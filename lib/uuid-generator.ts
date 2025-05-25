import { v4 as uuidv4 } from "uuid"

// Function to generate a random UUID
export function generateUUID(): string {
  return uuidv4()
}
