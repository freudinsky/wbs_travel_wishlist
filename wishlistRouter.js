import express from "express";
import countries from "./countries.js";
import { body } from "express-validator";
const router = express.Router();

let serialId = countries.length + 1;
const validation =
	body("name").notEmpty() &&
	body("alpha2Code").notEmpty().isLength({ min: 2, max: 2 }) &&
	body("alpha3Code").notEmpty().isLength({ min: 3, max: 3 });

router.use(express.json());

const filteredList = (countries, sort, visited) => {
	let filteredArr = countries;

	if (sort === "true") {
		filteredArr = filteredArr.sort((a, b) =>
			a.name.toLowerCase().localeCompare(b.name.toLowerCase())
		);
	}

	if (visited === "true") {
		filteredArr = filteredArr.filter((country) => country.visited);
	}
	return filteredArr;
};

const queryFilter = (req, res, next) => {
	const { sort, visited } = req.query;
	const countryArr = filteredList(countries, sort, visited);

	res.render("index", { countries: countryArr });
};

router.get("/", queryFilter);

router.use(express.json());
router.use(express.urlencoded({ extended: true })); 

router.post("/", (req, res) => {
	const { name, alpha2Code, alpha3Code } = req.body;
	console.log(req.body);
	const codeExist = countries.find((el) => {
		console.log("el.alpha2Code:", el.alpha2Code);
		console.log("el.alpha3Code:", el.alpha3Code);
		console.log("alpha2Code:", alpha2Code);
		console.log("alpha3Code:", alpha3Code);

		return (
			el.alpha2Code.toLowerCase() === alpha2Code.toLowerCase() ||
			el.alpha3Code.toLowerCase() === alpha3Code.toLowerCase()
		);
	});

	if (!codeExist) {
		if (validation) {
			const newDest = {
				id: serialId,
				name,
				alpha2Code,
				alpha3Code,
				visited: false,
			};
			countries.push(newDest);
			serialId++;
			res.status(200).render("index", { countries });
			console.log("Adding successful.");
		} else {
			res.status(400).send("Not a valid Country-Object");
			console.log("Not a valid Country-Object");
		}
	} else {
		res.status(400).send("Country already exists.");
		console.log("Country already exists.");
	}
});

router.get("/:code", (req, res) => {
	const code = req.params.code;
	const codeFound = countries.find(
		(el) =>
			el.alpha2Code.toLowerCase() === code ||
			el.alpha3Code.toLowerCase() === code
	);

	if (codeFound) {
		res.res.render("index", { countrArr: codeFound });
	} else {
		res.send("Country not found");
	}
});

router.put("/:code", (req, res) => {
	const code = req.params.code.toLowerCase();
	const item = countries.find(
		(el) =>
			el.alpha2Code.toLowerCase() === code ||
			el.alpha3Code.toLowerCase() === code
	);

	if (item) {
		if (validation) {
			req.body.name.toLowerCase() !== item.name.toLowerCase()
				? (item.name = req.body.name)
				: "";
			req.body.alpha2Code.toLowerCase() !== item.alpha2Code.toLowerCase()
				? (item.alpha2Code = req.body.alpha2Code.toUpperCase())
				: "";
			req.body.alpha3Code.toLowerCase() !== item.alpha3Code.toLowerCase()
				? (item.alpha3Code = req.body.alpha3Code.toUpperCase())
				: "";

			res.status(200).render("index", { countrArr: countries });
		}
	} else {
		res.send("No matching country found.");
	}
});

router.delete("/:code", (req, res) => {
	const code = req.params.code.toLowerCase();
	const item = countries.find(
		(el) =>
			el.alpha2Code.toLowerCase() === code ||
			el.alpha3Code.toLowerCase() === code
	);
	if (item) {
		if (!item.visited) {
			item.visited = true;
			res.status(200).render("index", { countrArr: countries });
		} else {
			res.status(400).send(`Country ${item.name} is already visited.`);
		}
	} else {
		res.status(404).send("Country not found.");
	}
});

export default router;
