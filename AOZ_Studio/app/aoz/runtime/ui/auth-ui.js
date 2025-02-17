
class authUi
{

	events_save
	lang
	onClose
	onError
	please_wait
	ui

	class(element)
	{
		return element.classList.value.split(' ')
			.filter(class_name => ['forgot-password', 'login', 'sign-up'].includes(class_name))[0]
	}

	close()
	{
		this.ui.remove()
		if (this.onClose) this.onClose.call(this.ui)
		document.onclick   = this.events_save.onclick
		document.onkeydown = this.events_save.onkeydown
		document.onkeyup   = this.events_save.onkeyup
	}

	constructor(ui, onClose = undefined, onError = undefined, lang = undefined)
	{
		this.lang    = lang
		this.onClose = onClose
		this.onError = onError
		this.ui      = ui
		ui.authUi    = this
		this.events()
		this.focusFirstEmpty()
		this.setAction()
	}

	emptyMessages()
	{
		this.ui.querySelectorAll('.messages > li').forEach((li) => li.remove())
		if (this.please_wait) {
			clearTimeout(this.please_wait)
			this.please_wait = undefined
		}
	}

	error(message)
	{
		this.message(message, 'error')
	}

	events()
	{
		const object = this
		const TAB    = 9
		const ENTER  = 13
		const SPACE  = 32

		this.events_save = {
			click:     document.onclick,
			onkeydown: document.onkeydown,
			onkeyup:   document.onkeyup
		}
		document.onclick   = undefined;
		document.onkeydown = undefined;
		document.onkeyup   = undefined;

		const addEventListeners = () =>
		{
			for (const li of this.ui.querySelectorAll('.actions > li')) {
				const button = li.getElementsByTagName('button')[0]
				button.addEventListener('click', buttonClick)
				button.addEventListener('keydown', buttonKey)
			}
			for (const li of this.ui.querySelectorAll('.fieldset input')) {
				li.addEventListener('keydown', inputKey)
			}
		}

		const buttonClick = function()
		{
			object.emptyMessages()
			let li       = this.parentElement
			let ui_class = object.class(object.ui)
			if (li.classList.contains('close')) {
				object.close()
				return false
			}
			if (li.classList.contains(ui_class)) {
				object.submit()
				return false
			}
			object.switchForm(this, li, ui_class)
			return false
		}

		const buttonKey = function(event)
		{
			if (![ENTER, SPACE].includes(event.keyCode)) return
			buttonClick.call(this, event)
			event.preventDefault()
			event.stopImmediatePropagation()
		}

		const inputKey = function(event)
		{
			object.emptyMessages()
			if (![ENTER, TAB].includes(event.keyCode)) return
			const all = this.closest('ul').getElementsByTagName('li')
			let   li  = event.shiftKey
				? this.parentElement.previousElementSibling
				: this.parentElement.nextElementSibling
			if ((event.keyCode === TAB) && !li) {
				li = all[event.shiftKey ? (all.length - 1) : 0]
			}
			while (li && !object.isVisible(li)) {
				li = event.shiftKey
					? li.previousElementSibling
					: li.nextElementSibling
				if ((event.keyCode === TAB) && !li) {
					li = all[event.shiftKey ? (all.length - 1) : 0]
				}
			}
			if (li) {
				li.getElementsByTagName('input')[0].focus()
			}
			else {
				object.submit()
			}
			event.preventDefault()
			event.stopImmediatePropagation()
		}

		addEventListeners()
	}

	focusFirstEmpty()
	{
		for (const input of this.ui.querySelectorAll('input')) {
			if (input.value || !this.isVisible(input)) continue
			input.focus()
			return
		}
		this.ui.querySelectorAll('.' + this.class(this.ui))[0].focus()
	}

	forgotPasswordIn(ui_class)
	{
		if (ui_class !== 'forgot-password') return
		this.ui.querySelectorAll('.password > input')[0].setAttribute('placeholder', this.lang.translate('account', 'new password'))
		this.ui.querySelectorAll('.confirm-password > input')[0].setAttribute('placeholder', this.lang.translate('account', 'confirm new password'))
		this.ui.querySelectorAll('.forgot-password > button')[0].textContent = this.lang.translate('account', 'Confirm by email')
	}

	forgotPasswordOut(ui_class)
	{
		if (ui_class !== 'forgot-password') return
		this.ui.querySelectorAll('.password > input')[0].setAttribute('placeholder', this.lang.translate('account', 'password'))
		this.ui.querySelectorAll('.confirm-password > input')[0].setAttribute('placeholder', this.lang.translate('account', 'confirm password'))
		this.ui.querySelectorAll('.forgot-password > button')[0].textContent = this.lang.translate('account', 'Forgot password')
	}

	information(message)
	{
		this.message(message, 'information')
	}

	isVisible(element)
	{
		while (element && (element !== this.ui)) {
			if (window.getComputedStyle(element).display === 'none') {
				return false
			}
			element = element.parentElement
		}
		return true
	}

	message(message, class_name)
	{
		this.emptyMessages()
		const messages = this.ui.getElementsByClassName('messages')[0]
		const new_line = document.createElement('li')
		if (class_name) new_line.classList.add(class_name)
		new_line.innerText = this.lang ? this.lang.translate('account', message) : message
		if (messages) messages.append(new_line)
	}

	setAction()
	{
		const ui = this.ui
		const button = ui.querySelectorAll('.actions li.' + this.class(ui) + ' > button')[0]
		if ((ui.tagName.toLowerCase() === 'form') && button.getAttribute('data-action')) {
			ui.setAttribute('action', button.getAttribute('data-action'))
		}
	}

	submit()
	{
		const values = {}
		for (const element of this.ui.querySelectorAll('.fieldset > li')) {
			if (!this.isVisible(element)) continue
			const input = element.getElementsByTagName('input')[0]
			const name  = element.classList.value
			const value = values[name] = input.value
			let   code  = 0
			let   error = ''
			let   what
			if (name.includes('confirm') && (value !== values[what = name.slice(8)])) {
				[code, error] = [
					203 + ['email', 'password'].indexOf(what),
					'The confirmation ' + what + ' does not match'
				]
			}
			else if (!value.length) {
				[code, error] = [
					201 + ['email', 'password'].indexOf(name),
					'The ' + name + ' is missing'
				]
			}
			else if ((name === 'email') && !value.match(/.+@.+\...+/)) {
				[code, error] = [205, 'The email address is not valid']
			}
			else if ((name === 'password') && (value.length < 4)) {
				[code, error] = [206, 'The password is too small']
			}
			if (error) {
				input.focus()
				if (this.onError) this.onError.call(this.ui, code, error)
				return this.error(error)
			}
		}
		const action = this.ui.getAttribute('action')
		const waitingInformation = () => {
			if (action.includes('authenticate')) {
				this.information('Authenticating...')
			}
			else if (action.includes('register')) {
				this.information('Registering...')
			}
			else if (action.includes('reset')) {
				this.information('Asking for password reset...')
			}
		}
		this.please_wait = setTimeout(waitingInformation, 500)
		this.ui.submit()
	}

	switchForm(button, li, ui_class)
	{
		this.forgotPasswordOut(ui_class)
		this.ui.classList.remove(ui_class)
		this.ui.classList.add(ui_class = this.class(li))
		this.ui.getElementsByTagName('h2')[0].textContent = button.textContent
		this.focusFirstEmpty()
		this.forgotPasswordIn(ui_class)
		this.setAction()
	}

}

document.addEventListener('DOMContentLoaded', () =>
{
	for (const ui of document.getElementsByClassName('auth-ui')) {
		new authUi(ui)
	}

})
