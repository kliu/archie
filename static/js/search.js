var searchElem = document.getElementById("search-input");
var index;
function loadSearch() { 
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				let posts = JSON.parse(xhr.responseText);
				if (posts) {
					postsByTitle = posts.reduce((acc, curr) => {
						acc[curr.title] = curr;
						return acc;
					}, {})
					if (index == null) {
						const fuseOptions = {
							shouldSort: true,
							includeMatches: true,
							threshold: 0.0,
							tokenize: true,
							location: 0,
							distance: 100,
							maxPatternLength: 32,
							minMatchCharLength: 1,
							keys: [{
								name: "title",
								weight: 0.8
							},
							{
								name: "contents",
								weight: 0.5
							},
							{
								name: "date",
								weight: 0.3
							},
							]
						};
						index = new Fuse(posts, fuseOptions);
						console.log(index);
					}
				}
			} else {
				console.log(xhr.responseText);
			}
		}
	};
	xhr.open('GET', "/index.json");
	xhr.send();
}
loadSearch();
function showSearchResults() {
	var query = searchElem.value || '';
	var searchString = query.replace(/\s+/g, '');
	var target = document.getElementById('search-result');
	if (searchString && searchString != '') {
		var matches = index.search(searchString);
		if (matches.length > 0) {
			target.innerHTML = matches.map(function (matche) {
				matche = matche.item
				if (matche != undefined) {
					return `<li class="post">
								<a href="${matche.url}"> ${matche.title}</a> <span class="meta">${matche.date}</span>
							</li>`;
				}
			}).join('');
		} else {
			target.innerHTML = `<br><h2 style="text-align:center">No search results found</h2>`;
		};		
		matches.map(matche => {
			matche = matche.item
			console.log(matche);
		})
	} else {
		target.innerHTML = ''
	}
};