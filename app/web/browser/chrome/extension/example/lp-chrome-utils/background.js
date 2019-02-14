const onInstalled = ()=> {
	console.log('post-install')

	chrome.storage.sync.set({
		color: 'hsl(134, 55%, 48%)',
	}, ()=> {
		console.log('store updated')
	})

	const pageRules = [{
		conditions: [new chrome.declarativeContent.PageStateMatcher({
			pageUrl: {urlMatches: '.*'},
		})],
		actions: [new chrome.declarativeContent.ShowPageAction()]
	}]

	chrome.declarativeContent.onPageChanged.removeRules(undefined, ()=>
		chrome.declarativeContent.onPageChanged.addRules(pageRules))
}
chrome.runtime.onInstalled.addListener(onInstalled)