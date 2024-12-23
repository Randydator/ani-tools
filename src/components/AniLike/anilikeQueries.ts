export const unreadCountQuery = `
query {
    User(name: "Rindidator") {
        unreadNotificationCount
	}
}
`

export const testQuery = `
query {
  Media(id: 1) {
    id
    title {
      english
    }
  }
}
`