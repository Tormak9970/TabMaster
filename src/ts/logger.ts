export const log = (name: string, ...args: any[]) => {
	if (process.env.NODE_ENV === 'development')
		console.log(
			   `%c TabMaster %c ${name} %c`,
			   'background: #16a085; color: black;',
			   'background: #1abc9c; color: black;',
			   'background: transparent;',
			   ...args,
		);
};

export const debug = (name: string, ...args: any[]) => {
	if (process.env.NODE_ENV === 'development')
		console.debug(
			   `%c TabMaster %c ${name} %c`,
			   'background: #16a085; color: black;',
			   'background: #1abc9c; color: black;',
			   'color: blue;',
			   ...args,
		);
};

export const error = (name: string, ...args: any[]) => {
	if (process.env.NODE_ENV === 'development')
		console.error(
			   `%c TabMaster %c ${name} %c`,
			   'background: #16a085; color: black;',
			   'background: #FF0000;',
			   'background: transparent;',
			   ...args,
		);
};

class Logger
{
	constructor(private name: string)
	{
		this.name = name;
	}

	log(...args: any[])
	{
		log(this.name, ...args);
	}

	debug(...args: any[])
	{
		debug(this.name, ...args);
	}

	error(...args: any[])
	{
		error(this.name, ...args);
	}
}

export default Logger;