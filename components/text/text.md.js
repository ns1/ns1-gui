export default `- wraps an input field, provides event handlers and inline validation
- allows for animated "pop" labels akin to material design
- allows for help text below the field when input is focused

#### required props

- **onChange** *(func)* function to be called. function should accept e param. e.currentTarget represents the react virtual event instance. value = (string, number) initial value. this isn't strictly required, but devtools will yell at you.

#### optional
- **autoFocus** *(bool)* on component mount, steal focus if possible
- **className** *(string)* dom wrapper classes to add (usually flex-* layout)
- **disabled** *(bool)* to disable/enable
- **defaultValue**: (string) fallback value if none provided
- **data-\*** *(string)* used to add tags for onchange handler that are passed as attributes
- **help** *(string)* addes help text under text element when focused
- **icon** *(string)* icon name to use (see icons section for info)
- **id** *(string)* suffix for id. rendered in dom, looks like: text-((props.id))
- **type** *(string)* passed through to input dom
- **label** *(string)* label text
- **noValid** *(bool)* disable inline validation
- **onBlur** *(func)* custom onBlur handler
- **onFocus** *(func)* custom focus handler
- **onKeydown** *(func)* custom keydown
- **onKeyPress** *(func*)
- **pattern** *(obj)* object with 2 keys, message (str) and pattern (regex | func). used for inline validation.
- **placeholder** *(string)* string for input placeholder text
- **required** *(string)* causes error class to be added if focus then blur with no value`;
