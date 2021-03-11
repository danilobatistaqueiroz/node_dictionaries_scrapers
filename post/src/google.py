import workfiles

def remove_frequency():
    '''remove translations with frequency 2 if there are others with frequency 3'''
    print('removing translations with frequency 1, if there are at least 1 translation with another frequency')
    rd = workfiles.read_lasttmp_or_output()
    cnt = workfiles.new_tmpfile()
    while True:
        exclude_all_frequence1 = False
        exclude_all_frequence2 = False
        line = rd.readline()
        if not line :
            break
        if len(line) < 5 :
            workfiles.write_tmpfile(cnt,line,'a')
            continue
        terms = line.split('\t')
        if len(terms) == 1 :
            workfiles.write_tmpfile(cnt,line,'a')
            continue
        if terms[1].find('(2)') >= 0 or terms[1].find('(3)') >= 0:
            exclude_all_frequence1 = True
        if terms[1].find('(3)') >= 0:
            exclude_all_frequence2 = True
        translations = terms[1].split(',')
        new_trs = []
        for translation in translations :
            ini = translation.find(')')
            if translation[1:ini] == '1' and exclude_all_frequence1 == True:
                continue
            if translation[1:ini] == '2' and exclude_all_frequence2 == True:
                continue
            new_trs.append(translation)
        new_line = ','.join(new_trs)
        if new_line[-1:] != '\n' :
            new_line = new_line+'\n'
        line = terms[0]+'\t'+new_line
        workfiles.write_tmpfile(cnt,line,'a')
    rd.close() 

def remove_replication():
    print('removing replications in translations')
    """sometime the scraper write more than once the same translation in lines"""
    rd = workfiles.read_lasttmp_or_output()
    cnt = workfiles.new_tmpfile()
    a_translations = ''
    while True:
        line = rd.readline()
        if not line :
            break
        if len(line) < 5 :
            workfiles.write_tmpfile(cnt,line,'a')
            continue
        terms = line.split('\t')
        if len(terms) == 1 :
            workfiles.write_tmpfile(cnt,line,'a')
            continue
        word = terms[0].strip()
        translations = terms[1]
        if translations == a_translations:
            workfiles.write_tmpfile(cnt,word+'\t\n','a')
        else:
            workfiles.write_tmpfile(cnt,line,'a')
        a_translations = translations

def is_first_translation_without_frequency(translations):
    return translations[0].find(')') == -1

def remove_same_translations():
    print('removing two equal translations')
    '''it hapens when a translation is considered principal without frequency, 
       and another has a frequency, both same translation
    '''
    rd = workfiles.read_lasttmp_or_output()
    cnt = workfiles.new_tmpfile()
    while True:
        line = rd.readline()
        if not line :
            break
        if len(line) < 5 :
            workfiles.write_tmpfile(cnt,line,'a')
            continue
        terms = line.split('\t')
        if len(terms) == 1 :
            workfiles.write_tmpfile(cnt,line,'a')
            continue
        translations = terms[1].split(',')
        new_trs = []
        anterior_translation = ''
        for translation in translations:
            ini = translation.find(')')
            term_translation = translation[ini+1:].strip().lower()
            if term_translation == anterior_translation:
                continue
            anterior_translation = term_translation
            new_trs.append(translation)
        new_line = ','.join(new_trs)
        if new_line[-1:] != '\n' :
            new_line = new_line+'\n'
        line = terms[0]+'\t'+new_line
        workfiles.write_tmpfile(cnt,line,'a')
    rd.close()

def remove_same_translations_without_frequency():
    print('removing translation without frequency if there is another')
    rd = workfiles.read_lasttmp_or_output()
    cnt = workfiles.new_tmpfile()
    while True:
        line = rd.readline()
        if not line :
            break
        if len(line) < 5 :
            workfiles.write_tmpfile(cnt,line,'a')
            continue
        terms = line.split('\t')
        if len(terms) == 1 :
            workfiles.write_tmpfile(cnt,line,'a')
            continue
        translations = terms[1].split(',')
        new_trs = []
        if is_first_translation_without_frequency(translations):
            has_with_frequency=False
            for translation in translations[1:]:
                ini = translation.find(')')
                term_translation = translation[ini+1:].strip().lower()
                if term_translation == translations[0]:
                    has_with_frequency=True
            if has_with_frequency:
                new_trs = translations[1:]
            else:
                new_trs = translations
        else:
            new_trs = translations
        new_line = ','.join(new_trs)
        if new_line[-1:] != '\n' :
            new_line = new_line+'\n'
        line = terms[0]+'\t'+new_line
        workfiles.write_tmpfile(cnt,line,'a')
    rd.close()

def remove_same_word():
    print('removing translation equal word')
    rd = workfiles.read_lasttmp_or_output()
    cnt = workfiles.new_tmpfile()
    while True:
        line = rd.readline()
        if not line :
            break
        if len(line) < 5 :
            workfiles.write_tmpfile(cnt,line,'a')
            continue
        terms = line.split('\t')
        if len(terms) == 1 :
            workfiles.write_tmpfile(cnt,line,'a')
            continue
        word = terms[0].strip()
        translations = terms[1].split(',')
        new_trs = []
        for translation in translations :
            ini = translation.find(')')
            if translation.strip() == '':
                continue
            if translation[ini+1:][0].isupper() :
                continue
            if translation[ini+1:].strip().lower() == word.lower() :
                continue
            new_trs.append(translation)
        new_line = ','.join(new_trs)
        if new_line[-1:] != '\n' :
            new_line = new_line+'\n'
        line = terms[0]+'\t'+new_line
        workfiles.write_tmpfile(cnt,line,'a')
    rd.close()

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
        if len(fields) == 1:
            terms = ''
        else:
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

def only_four_translations():
    print('let only the first 4 translations and remove the other ones')
    rd = workfiles.read_lasttmp_or_output()
    cnt = workfiles.new_tmpfile()
    while True:
        line = rd.readline()
        if not line :
            break
        if len(line) < 5 :
            workfiles.write_tmpfile(cnt,line,'a')
            continue
        terms = line.split('\t')
        if len(terms) == 1 :
            workfiles.write_tmpfile(cnt,line,'a')
            continue
        translations = terms[1].split(',')
        new_line = ','.join(translations[:4])
        if new_line[-1:] != '\n' :
            new_line = new_line+'\n'
        line = terms[0]+'\t'+new_line
        workfiles.write_tmpfile(cnt,line,'a')
    rd.close()

def initialize(dictionary, word_list):
    workfiles.word_list = word_list
    workfiles.dictionary = dictionary

def start():
    workfiles.rem_tmpfiles()
    reorganizeTranslations()
    remove_frequency()
    remove_same_word()
    remove_same_word()
    remove_same_translations()
    remove_same_translations_without_frequency()
    only_four_translations()
    workfiles.remove_last_comma()
    workfiles.treat_line1001()
    workfiles.rem_tmpfiles_create_outfile()