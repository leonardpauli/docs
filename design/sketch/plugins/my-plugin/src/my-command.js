// import utils from 'sketch-utils'
import {log as dlog} from 'string-from-object'

export default function(context) {
  context.document.showMessage("It's alive 🙌")
  logns(context.document.pages()[0].layers()[0])
}
 
const logns = ns=> {
  dlog('\n\n\n\n')
  // dlog(String(ns.treeAsDictionary().toString())
  dlog(ns.treeAsDictionary(), {
  	nameExtractor: o=> o && o['<class>'],
  	filter: ({key})=> key!=='<class>',
  })
  // dlog(utils.prepareValue(ns, {
  // 	skipMocha: false,
  // 	withAncestors: false,
  // 	withTree: true,
  // }))
}
