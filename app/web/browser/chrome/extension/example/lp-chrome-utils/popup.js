let changeColor = document.getElementById('changeColor')

chrome.storage.sync.get('color', data=> {
	changeColor.style.backgroundColor = data.color
	changeColor.setAttribute('value', data.color)
})

changeColor.onclick = el=> {
	let color = el.target.value
	chrome.tabs.query({active: true, currentWindow: true}, tabs=> {
		chrome.tabs.executeScript(tabs[0].id, {
			code: 'document.body.style.backgroundColor = "'+color+'";'
		})
	})
}


let copyTabUrls = document.getElementById('copyTabUrls')
copyTabUrls.onclick = el=> {
	chrome.windows.getAll({populate: true}, windows=> {
		let txt = ''
		windows.forEach(window=> {
			window.tabs.forEach(tab=> {
				console.log(tab.url)
				txt += tab.url+'\n'
			})
			txt += '\n'
		})
		clipboardCopyText(txt)
	})
}

// based on https://stackoverflow.com/questions/3436102/copy-to-clipboard-in-chrome-extension
const clipboardCopyText = text=>  {
  const el = document.createElement('textarea')
  el.textContent = text
  document.body.appendChild(el)
  el.select()
  document.execCommand('copy')
  el.blur() // ?
  document.body.removeChild(el)
}
