
    
    export const mockProjects = [
    {
        projectId: 1,
        projectTitle: "E-commerce Website Development",
        projectDeadline: "2024-03-30T00:00:00",
        minBudget: 5000,
        maxBudget: 10000,
        projectStateId: 1,
        projectStateType: "Active",
        userId: 1,
        symbol: "$",
        countryName: "United States",
        projectDescription: "Build a full-featured e-commerce platform",
        language: "English",
        createdAt: "2024-01-15T00:00:00",
        code: "USD"
    },
    {
        projectId: 2,
        projectTitle: "Mobile App Development",
        projectDeadline: "2024-04-15T00:00:00",
        minBudget: 8000,
        maxBudget: 15000,
        projectStateId: 2,
        projectStateType: "In Progress",
        userId: 1,
        symbol: "€",
        countryName: "Germany",
        projectDescription: "Develop a cross-platform mobile application",
        language: "German",
        createdAt: "2024-01-20T00:00:00",
        code: "EUR"
    },
    {
        projectId: 3,
        projectTitle: "AI Chat Integration",
        projectDeadline: "2024-05-01T00:00:00",
        minBudget: 3000,
        maxBudget: 6000,
        projectStateId: 3,
        projectStateType: "Completed",
        userId: 1,
        symbol: "£",
        countryName: "United Kingdom",
        projectDescription: "Integrate AI chatbot functionality",
        language: "English",
        createdAt: "2024-01-25T00:00:00",
        code: "GBP"
    }
    ];

    export const mockProjectStates = [
        { projectStateId: 1, projectStateType: 'Active' },
        { projectStateId: 2, projectStateType: 'Completed' }
    ];