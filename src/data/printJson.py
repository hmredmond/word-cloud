import json

myarray = ["Chance",
"Dieux",
"Défaite",
"Gloire",
"Rois",
"Rois",
"Triomphe",
"Victoire",
"aimer",
"amant",
"amis",
"après",
"autres",
"bon",
"bouches",
"brave",
"ce",
"cent",
"ces",
"cesser",
"connaître",
"conseillant",
"conserver",
"coup",
"courage",
"de",
"de",
"des",
"des",
"destructeur",
"deux",
"devenir",
"digne",
"dire",
"dur",
"défendre",
"détruit",
"d’amour",
"d’entendre",
"d’entendre",
"d’eux",
"d’un",
"d’un",
"d’être",
"en",
"en",
"en",
"en",
"en",
"esclaves",
"et",
"et",
"et",
"et",
"et",
"et",
"et",
"exciter",
"fils",
"folles",
"fort",
"fou",
"front",
"frère",
"gain",
"geste",
"gueux",
"haï",
"haïr",
"homme",
"imprudent",
"jamais",
"jamais",
"jamais",
"jamais",
"la",
"la",
"la",
"laisser",
"le",
"les",
"les",
"les",
"les",
"les",
"les",
"leurs",
"lutter",
"l’ouvrage",
"mais",
"maître",
"menteurs",
"mentir",
"mentir",
"mettre",
"mieux",
"mon",
"moral",
"mot",
"mot",
"méditer",
"même",
"ni",
"n’être",
"observer",
"ou",
"par",
"paroles",
"parties",
"penseur",
"perdre",
"perdront",
"peuple",
"peux",
"peux",
"peux",
"peux",
"peux",
"peux",
"peux",
"peux",
"peux",
"peux",
"peux",
"populaire",
"pour",
"pour",
"pédant",
"que",
"qui",
"qu’aucun",
"qu’un",
"rage",
"rebâtir",
"recevoir",
"rencontrer",
"rester",
"rester",
"rois",
"rêve",
"sage",
"sais",
"sais",
"sais",
"sans",
"sans",
"sans",
"sans",
"sans",
"sans",
"sans",
"sans",
"sceptique",
"sentant",
"seras",
"seul",
"seul",
"si",
"si",
"soit",
"sots",
"soumis",
"soupir",
"supporter",
"sur",
"ta",
"ta",
"te",
"te",
"te",
"tendre",
"tes",
"tes",
"tes",
"toi",
"toi",
"toi-même",
"ton",
"ton",
"ton",
"ton",
"tour",
"tous",
"tous",
"tous",
"tout",
"tu",
"tu",
"tu",
"tu",
"tu",
"tu",
"tu",
"tu",
"tu",
"tu",
"tu",
"tu",
"tu",
"tu",
"tête",
"un",
"un",
"un",
"un",
"un",
"vaut",
"vie",
"voir",
"à",
"à",
"à",
"étant",
"être",
"être",
"être",
"être",
"être",
"être",
"être",
"être",
"être",
"être",
"Alors",
"Et",
"Et",
"Et",
"Et",
"Et",
"Et",
"Ou",
"Penser",
"Pourtant",
"Quand",
"Rêver",
"Sans",
"Sans",
"Sans",
"Sans",
"Sans",
"Seront",
"Si",
"Si",
"Si",
"Si",
"Si",
"Si",
"Si",
"Si",
"Si",
"Si",
"Si",
"Si",
"Travesties",
"Tu"]

i = 0
totalArray = []

print("[")
for line in myarray:
	count = myarray.count(line)
	if line in totalArray:
		continue
	totalArray.append(line)
	print("{\"word\":\"" +line + "\",\"score\": {\"freq\": " ,count, ",\"importance\": ",i,"},\"translation\":  {\"eng\": \"ENGLISH\"},\"visible\": true}")
	if (i < len(myarray) - 1):
		print(",")
	i += 1
print("]")
