var index;
function loadSearch() { 
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				let posts = JSON.parse(xhr.responseText);
				if (posts) {
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
						}
						]
					};
					index = new Fuse(posts, fuseOptions);
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
	let query = document.getElementById("search-input").value || '';
	let searchString = query.replace(/\s+/g, '');
	let target = document.getElementById('search-result');
	if (searchString && searchString != '') {
		let matches = index.search(searchString);
		console.log(matches)
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
	} else {
		target.innerHTML = ''
	}
};