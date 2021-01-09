import os
import workfiles

workfiles.dictionary = 'linguee'
workfiles.word_list = '1001-2000'

def remove_field_doesnt_match(word):
    print("""remove row where a field doesn't have any word matching in others dictionaries""")

def translations_match_other_dictionaries(word):
    word = word.lower()
    word_list = workfiles.word_list
    path1 = '/home/element/Documents/english/anki-files/mostcommon-40000/output'
    thesaurus_path = f'{path1}/{word_list}-thesaurus.csv'
    if os.path.exists(thesaurus_path):
        thesaurus = open(thesaurus_path, 'r')
        while True:
            line = thesaurus.readline()
            if not line:
                thesaurus.close()
                break
            fields = line.split('\t')
            if len(fields) > 4:
                terms = fields[4].lower().split(',')
                if word in terms:
                    thesaurus.close()
                    return True
    yandex_path = f'{path1}/{word_list}-yandex.csv'
    if os.path.exists(yandex_path):
        yandex = open(yandex_path, 'r')
        while True:
            line = yandex.readline()
            if not line:
                yandex.close()
                break
            fields = line.split('\t')
            if len(fields) > 2:
                terms = fields[2].lower().split(',')
                if word in terms:
                    yandex.close()
                    return True
    path2 = '/home/element/tutorials/puppeteer/output'
    cambridge_path = f'{path2}/{word_list}-cambridge.csv'
    if os.path.exists(cambridge_path):
        cambridge = open(cambridge_path, 'r')
        while True:
            line = cambridge.readline()
            if not line:
                cambridge.close()
                break
            fields = line.split('\t')
            if len(fields) > 1:
                terms = fields[1].lower().split(',')
                if word in terms:
                    cambridge.close()
                    return True
    google_path = f'{path2}/{word_list}-google.csv'
    if os.path.exists(google_path):
        google = open(google_path, 'r')
        while True:
            line = google.readline()
            if not line:
                google.close()
                break
            fields = line.split('\t')
            if len(fields) > 1:
                terms = fields[1].lower().split(',')
                if word in terms:
                    google.close()
                    return True
    reverso_path = f'{path2}/{word_list}-reverso.csv'
    if os.path.exists(reverso_path):
        reverso = open(reverso_path, 'r')
        while True:
            line = reverso.readline()
            if not line:
                reverso.close()
                break
            fields = line.split('\t')
            if len(fields) > 1:
                terms = fields[1].lower().split(',')
                if word in terms:
                    reverso.close()
                    return True


def insert_comma():
    print('inserting commas')
    rd = workfiles.read_lasttmp_or_output()
    cnt = workfiles.new_tmpfile()
    while True:
        line = rd.readline()
        if not line :
            break
        line = line.replace('\n','')
        if len(line) < 5 :
            workfiles.write_tmpfile(cnt,line+'\n','a')
            continue
        terms = line.split('\t')
        if len(terms) == 1 :
            workfiles.write_tmpfile(cnt,line+'\n','a')
            continue
        words = terms[1].split(',')
        new_words = []
        for word in words :
            new_word = word.replace('    ',' ')
            new_word = new_word.replace('   ',' ')
            new_word = new_word.replace('  ',' ')
            new_word = new_word.replace(' ',', ')
            word = word.strip()
            if word.lower() == terms[0].lower() :
                continue
            if word == '' or word == ',' :
                continue
            new_words.append(new_word)
        new_line = ','.join(new_words)
        new_line = new_line.replace(', , ',',')
        line = terms[0]+'\t'+new_line
        workfiles.write_tmpfile(cnt,line+'\n','a')
    rd.close()

def substitutes(dirt, text, content):
    pos = 1
    while pos > 0 :
        pos = content.find(dirt,pos+1)
        if pos == -1 :
            break
        content = content[:pos] + text + content[pos+len(dirt):]
    return content

def clean_debbris():
    print('cleaning all info words')
    content = workfiles.get_content_tmp_output()
    cnt = workfiles.new_tmpfile()
    four_commas = ',​,, ,'
    four_commas_spaces = ', ​,, ,'
    f_commas = ', f ​,, ,'
    endline = ',​,\n'
    dot_comma = ',​,·'
    two_comma_dot = ', ​,·'
    m_comma = ', m ​,·'
    tab_comma = '\t, ,'
    f_dot_comma = ', f ​,·'
    m_commas = ', m ​,, ,'
    three_comma = ' ​,, ,'
    s_dot_comma = ', s ​,·'
    comma_f_dot = ', f ​,·'
    comma_m_comma = ', m ​,'
    comma_prep_comma = ', prep ​,'
    comma_pl_dot = ', pl ​,·'
    comma_f_comma = ', f ​,'
    comma_num_comma = ', num ​,'
    dot_dot_end = ', ​,\n'
    comma_np_f_comma = ', np f ​,'
    comma_prep_comma_dot = ', prep ​,·'
    comma_s_comma = ', s,'
    comma_s = ', s ​,'
    comma_interj_comma = ', interj ​,'
    comma_conj_comma = ', conj ​,'
    num_comma = ', num,'
    comma_new_ln = ',\n'
    comma_sp_prep_comma = ', prep,'
    prop = ', prop.'
    sp_pl = ' pl​,'
    comma_n_comma = ',n,'
    sp_pl_sp = ' pl ​'
    comma_pron_comma = ', pron,'
    comma_conj = ', conj,'
    part_pas = ', part. pas.,'
    np_m_comma = ', np m,'
    content = substitutes(four_commas,',',content)
    content = substitutes(f_commas,',',content)
    content = substitutes(endline,'\n',content)
    content = substitutes(dot_comma,',',content)
    content = substitutes(m_comma,',',content)
    content = substitutes(tab_comma,'\t',content)
    content = substitutes(f_dot_comma,',',content)
    content = substitutes(m_commas,',',content)
    content = substitutes(s_dot_comma,',',content)
    content = substitutes(four_commas_spaces,',',content)
    content = substitutes(comma_f_dot,',',content)
    content = substitutes(three_comma,',',content)
    content = substitutes(two_comma_dot,',',content)
    content = substitutes(comma_m_comma,',',content)
    content = substitutes(comma_prep_comma,',',content)
    content = substitutes(comma_pl_dot,',',content)
    content = substitutes(comma_f_comma,',',content)
    content = substitutes(comma_num_comma,',',content)
    content = substitutes(dot_dot_end,'\n',content)
    content = substitutes(comma_np_f_comma,',',content)
    content = substitutes(comma_prep_comma_dot,',',content)
    content = substitutes(comma_s_comma,',',content)
    content = substitutes(comma_s,',',content)
    content = substitutes(comma_interj_comma,',',content)
    content = substitutes(comma_conj_comma,',',content)
    content = substitutes(num_comma,',',content)
    content = substitutes(comma_new_ln,'\n',content)
    content = substitutes(comma_sp_prep_comma,',',content)
    content = substitutes(prop,',',content)
    content = substitutes(sp_pl,',',content)
    content = substitutes(comma_n_comma,',',content)
    content = substitutes(sp_pl_sp,' ',content)
    content = substitutes(comma_pron_comma,',',content)
    content = substitutes(comma_conj,',',content)
    content = substitutes(part_pas,',',content)
    content = substitutes(np_m_comma,',',content)
    content = substitutes(',,',',',content)
    content = substitutes(', ,',',',content)
    content = substitutes('·','',content)
    workfiles.write_tmpfile(cnt,content,'w')

def remove_spaces_between_words():
    print('removing spaces between words')
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
        words = terms[1].split(',')
        new_line = ','.join(words)
        new_line = new_line.replace(', ',',')
        workfiles.write_tmpfile(cnt,terms[0]+'\t'+new_line,'a')
    rd.close()

workfiles.rem_tmpfiles()
clean_debbris()
insert_comma()
remove_spaces_between_words()
workfiles.count_words()
workfiles.treat_line1001()
workfiles.rem_tmpfiles_create_outfile()