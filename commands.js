function loadCollection([ cname, c ]){
	const cel = Klaws.get("collection");
	cel.apply("title", cname);
	cel.apply("description", c.description);

	let short = c.description.length < 50
		? c
		: c.description.slice(0, 50)
			.split(' ')
			.slice(0, -1)
			.join(' ')
	;
	cel.apply("description.short", short);

	for(const command of c.commands){
		const {
			name,
			description,
			message_usage,
			slash_usage,
			aliases,
			premium_user,
			premium_guild
		} = command;
		const coel = Klaws.get("command");
		coel.compose(
			"title", `/${name}`,
			"description", description,
			"musage", message_usage,
			"susage", `/${slash_usage}`,
			"aliases", (aliases && aliases[0])
				? aliases.join('\n')
				: "None"
		);

		if(premium_user){
			coel.element.classList.add("premium");
		}

		if(premium_guild){
			coel.element.classList.add("premium-guild");
		}

		coel.append(cel.element);
	}

	return cel;
}

let commands = null;
let commandsLoader = null;
async function main(){
	if(!commands)
		await commandsLoader
	;

	Object.entries(commands)
		.map(loadCollection)
		.map(ki => ki.append(document.body))
	;
};

window.addEventListener("DOMContentLoaded", main);

commandsLoader = new Promise(async function(res, rej){
	commands = await (await fetch("https://api.killua.dev/commands"))
		.json()
	;

	res(commands);
});

qevent("click", ".collection .header", function(ev, el){
	el.parentElement.classList.toggle("open");
});

qevent("click", ".command .title-box", function(ev, el){
	el.parentElement.classList.toggle("open");
});

qevent("click", "*", function(ev, el){
	const hintbox = document.querySelector(".hint");
	hintbox.classList.remove("visible");

	if(ev.target.matches(".premium-user")){
		hintbox.classList.add("visible");

		hintbox.textContent = "This command can only be used by premium"
			+ " user"
		;
	}

	if(ev.target.matches(".premium-guild")){
		hintbox.classList.add("visible");

		hintbox.textContent = "This command can only be used by premium"
			+ " guild"
		;
	}

	if(ev.target.matches(".musage")){
		hintbox.classList.add("visible");
		hintbox.textContent = "Copied!";

		navigator.clipboard.writeText(ev.target.textContent);
	}

	if(ev.target.matches(".susage")){
		hintbox.classList.add("visible");
		hintbox.textContent = "Copied!";

		navigator.clipboard.writeText(ev.target.textContent);
	}

	hintbox.style.left = ev.x + "px";
	hintbox.style.top = ev.y + "px";
});
