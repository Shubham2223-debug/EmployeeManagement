// JavaScript source code
const API_URL = "https://localhost:7079/api/Auth"

export const login = async (username, password) => {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || "Invalid username or password")
    }

    return data
}