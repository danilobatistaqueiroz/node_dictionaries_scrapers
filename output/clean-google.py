def reorganizeTranslations():
    rd = open ('4001-5000-googletranslator.csv', 'r')
    counter = 0
    output = ''
    while True:
        counter+=1
        line = rd.readline()
        #if counter == 10 :
        #    break
        if not line :
            break
        line = line[:-1]
        fields = line.split('\t')
        word = fields[0]
        terms = fields[1].split(',')
        others = {}
        i = 0
        if len(terms) > 1 :
            if terms[0][:-1] == terms[1] and terms[0][-1:] == 'a' :
                i = 1
            if len(terms[0]) == len(terms[1]) and terms[1][-1:] == 'o' and terms[0][-1:] == 'a' :
                i = 1
        while i < len(terms):
            if terms[i][3:4].isupper() and word[0:1].isupper() :
                i+=1
                continue
            if terms[i][0:1] == '(' :
                others[terms[i][3:].lower()] = terms[i][:3]
            else :
                if terms[i] not in others:
                    others[terms[i].lower()] = '*'
            i += 1
        others = dict(sorted(others.items(), key=lambda item: item[1], reverse=True))
        output += word+'\t'
        for term in others:
            if others[term]=='*' :
                others[term] = ''
            output += others[term]+term+','
        output+='\n'
    rd.close()
    file = open('4001-5000-googletranslator-reorganized2.csv','w')
    file.write(output)

reorganizeTranslations()