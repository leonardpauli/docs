# Docs
*Personal collection of development related notes, snippets, and workflows*

### Structure

_See docs/contents.rim_

It's a graph-structure:

- each folder is a subject and can contain an index file `"\(folder.name).rim"`
- each folder can contain subfolders, denoted `top-level-subject.subject.sub-subject...`
- naming
	- lower-case, dashes instead of spaces
	- singular; eg. folder containing examples: `app.java.example.hello-world`
	- logical units; eg. `app.web.browser.chrome` instead of eg. `web-browser.chrome`
- if a block in the index file gets large (eg. > ~ half a screen), refactor it out to its own file with ref `see ./sub-subject`

Workflow:

- on work with subject.new: add entry/folder/file in graph
- add note + links etc
- format note in rim-style language mixed with shell etc; concise and to the point
- try add some minimal examples if suitable
- why: to decrease friction of tackling a new subject
- why: to create a knowledge-base, etc


### How to read

Many files are using my `rim` syntax (WIP, similar to *yaml* as base), which will soon (if not, please poke me) be available. In the meantime, it's just text :)


### Contribute

Feel free to fork and send PR's :)

Copyright © Leonard Pauli, 2018

Licence: GNU Affero General Public License v3.0

(except when noted otherwise, eg. external submodules etc)
For commersial / closed-source / custom licencing needs, please contact us.
