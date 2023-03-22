/**
 * - Github graphql single api endpoint.
 */
const GITHUB_GRAPHQL_ENDPOINT = "https://api.github.com/graphql";
const API_TOKEN = "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";

//async function to run our http request immediately we run the web server
(async function () {
	//variable holding the requested user's username
	const username = "Nixhazel";

	//graphql query to get needed data
	const data = {
		query: `
query GetUserGithubDetails($username: String!){
  user(login: $username) {  
    avatarUrl(size: 250)
    bio
    name
    login
    allRepos: repositories {
        totalCount
    }  
    repositories(privacy: PUBLIC, first: 20) {
      totalCount
      nodes {
        name
        description
        forkCount
        updatedAt
        stargazers {
          totalCount
        }
         languages(first: 1) {
          nodes {
            color
            name
          }
        }
        forks {
          totalCount
        }
      }
    }
    
  }
}
    `,
		variables: {
			username: `${username}`,
		},
	};
	//declaring variables in graphql queries

	//awaiting fetch request
	const response = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
		method: "post",
		mode: "cors",
		headers: {
			Accept: "application/json",
			Authorization: `Bearer ${API_TOKEN}`,
		},
		body: JSON.stringify(data),
	});

	/**
	 * Execute the query, and await the response
	 */
    const json = await response.json();
    console.log(json.data.user);

	/**
	 * Check if the query produced errors, otherwise use the results
	 */
	if (json.errors) {
		console.log(json.errors);
	} else {
		console.log(json.data);
	}
})();
