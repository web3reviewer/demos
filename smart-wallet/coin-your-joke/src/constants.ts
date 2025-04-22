const environment=process.env.ENV

export const PROJECT_URL=environment=="local"?"https://localhost:3000":process.env.NEXT_PUBLIC_URL