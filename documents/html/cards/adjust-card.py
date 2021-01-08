def substitutes(inter, text, content):
    pos = content.find(inter)
    content = content[:pos] + text + content[pos+len(inter):]
    return content

def interpolation_to_text():
    word = 'slipped'
    reverso = '(8050)ace,(2000)free,(500)ox,(100)nothing,(5)great'
    google = '(3)no,(3)please,(2)fight,(1)yes,(1)zero'
    linguee = 'no,please,fight,yes,zero'
    cambridge = 'no,please,fight,yes,zero'
    deepl = 'worked,problems'
    yandex = 'haul,harbor,last'
    with open ('card-4001-5000.html', 'r') as file:
        content = file.read()
    content = substitutes('{{word}}',word,content)
    content = substitutes('{{reverso}}',reverso,content)
    content = substitutes('{{google}}',google,content)
    content = substitutes('{{linguee}}',linguee,content)
    content = substitutes('{{cambridge}}',cambridge,content)
    content = substitutes('{{deepl}}',deepl,content)
    content = substitutes('{{yandex}}',yandex,content)
    file = open('card-4001-5000-testes.html','w')
    file.write(content)

interpolation_to_text()