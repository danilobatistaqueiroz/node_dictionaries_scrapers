import workfiles

workfiles.word_list = '1001-2000'
workfiles.dictionary = 'google'

def reorganizeTranslations():
    print("""remove a term when have both male and female,
    change the main translation to the front of translations,
    sort the translations by frequency,
    remove terms beggining with "o", "a", "os", "as"
    """)
    rd = workfiles.read_lasttmp_or_output()
    cnt = workfiles.new_tmpfile()
    output = ''
    while True:
        line = rd.readline()
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
        output = output.replace(')a ',')').replace(')o ',')').replace(')os ',')').replace(')as ',')')
        output+='\n'
    rd.close()
    workfiles.write_tmpfile(cnt,output,'a')

workfiles.rem_tmpfiles()
reorganizeTranslations()
workfiles.remove_last_comma()
workfiles.treat_line1001()
workfiles.rem_tmpfiles_create_outfile()