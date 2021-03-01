import workfiles

def rem_spaces_between_translations():
    print('remove spaces between comma in translations')
    rd = workfiles.read_lasttmp_or_output()
    cnt = workfiles.new_tmpfile()
    while True:
        line = rd.readline()
        line = line[:-1]
        if not line :
            break
        line = line.replace('\n','')
        fields = line.split('\t')
        fields[1] = fields[1].replace(', ',',')
        if len(fields) >= 5:
            newline = fields[0]+'\t'+fields[1]+'\t'+fields[2]+'\t'+fields[3]+'\t'+fields[4]+'\n'
        else:
            newline = fields[0]+'\t'+fields[1]+'\t'+fields[2]+'\t'+fields[3]+'\t\n'
        workfiles.write_tmpfile(cnt,newline,'a')
    rd.close()

def is_firstfield_equals_word():
    print('is first field equals word?')
    outputfile = workfiles.read_outputfile()
    inputfile = workfiles.read_inputfile()
    word = inputfile.readline()
    field = outputfile.readline().split('\t')[0]
    if word.strip() == field.strip():
        return True
    else:
        return False

def definitions_startswith_number():
    print('verifying if definitions field starts with number')
    rd = workfiles.read_lasttmp_or_output()
    line = rd.readline()
    fields = line.split('\t')
    if fields[4].startswith('1.'):
        return True
    else:
        return False
    rd.close()

def organize_definitions_with_n():
    rd = workfiles.read_lasttmp_or_output()
    cnt = workfiles.new_tmpfile()
    while True:
        line = rd.readline()
        if not line :
            break
        line = line.replace('\n','')
        fields = line.split('\t')
        fields[4] = fields[4].replace('. ,','. ')
        newline = fields[0]+'\t'+fields[1]+'\t'+fields[2]+'\t'+fields[3]+'\t'+fields[4]+'\n'
        workfiles.write_tmpfile(cnt,newline,'a')
    rd.close()

def organize_definitions_without_n():
    print('organizing definitions without numbers')
    rd = workfiles.read_lasttmp_or_output()
    cnt = workfiles.new_tmpfile()
    while True:
        line = rd.readline()
        if not line :
            break
        line = line.replace('\n','')
        fields = line.split('\t')
        if fields[4].strip() != '':
            fields[4] = '1. '+fields[4]
        num = 1
        while fields[4].find('. ,') > -1:
            num+=1
            fields[4] = fields[4].replace('. ,','. '+str(num)+'. ', 1)
        newline = fields[0]+'\t'+fields[1]+'\t'+fields[2]+'\t'+fields[3]+'\t'+fields[4]+'\n'
        workfiles.write_tmpfile(cnt,newline,'a')
    rd.close()

def organize_definitions():
    print('organizing the definitions field')
    if definitions_startswith_number() == True:
        organize_definitions_with_n()
    else:
        organize_definitions_without_n()

def clean_ipa():
    print('cleaning ipa, adding space between translations')
    rd = workfiles.read_lasttmp_or_output()
    cnt = workfiles.new_tmpfile()
    while True:
        line = rd.readline()
        if not line :
            break
        line = line[:-1]
        fields = line.split('\t')
        ipa = fields[2]
        ipa = ipa.replace('/<span','<span')
        ipa = ipa.replace('</span>/','</span>')
        pt = fields[1]
        fields[2] = ipa
        fields[1] = pt
        workfiles.write_tmpfile(cnt,'\t'.join(fields)+'\n','a')
    rd.close()

def sound_mp3_directory():
    print('change the reference of sound in mp3 field')
    rd = workfiles.read_lasttmp_or_output()
    cnt = workfiles.new_tmpfile()
    while True:
        line = rd.readline()
        if not line :
            break
        line = line.replace('\n','')
        fields = line.split('\t')
        fields[3] = workfiles.add_wordlist_dictionary_soundmp3(fields[3])
        newline = fields[0]+'\t'+fields[1]+'\t'+fields[2]+'\t'+fields[3]+'\t'+fields[4]+'\n'
        workfiles.write_tmpfile(cnt,newline,'a')
    rd.close()

def remove_wordlist_from_soundname():
    print('remove wordlist from name of mp3 sound')
    rd = workfiles.read_lasttmp_or_output()
    cnt = workfiles.new_tmpfile()
    while True:
        line = rd.readline()
        if not line :
            break
        line = line.replace('\n','')
        fields = line.split('\t')
        fields[3] = fields[3].replace(workfiles.word_list+'-','')
        newline = fields[0]+'\t'+fields[1]+'\t'+fields[2]+'\t'+fields[3]+'\t'+fields[4]+'\n'
        workfiles.write_tmpfile(cnt,newline,'a')
    rd.close()


def initialize(dictionary, word_list):
    workfiles.word_list = word_list
    workfiles.dictionary = dictionary

def start():
    workfiles.rem_tmpfiles()
    valid = workfiles.validate_number_tabs(3)
    if valid == True:
        if is_firstfield_equals_word() == False:
            cnt=workfiles.get_last_tmpcnt()
            cnt=cnt+1
            workfiles.add_word_to_firstfield(cnt)
    valid = workfiles.validate_number_tabs(4)
    if valid == True:
        rem_spaces_between_translations()
        clean_ipa()
        #remove_wordlist_from_soundname()
        sound_mp3_directory()
        organize_definitions()
        workfiles.treat_line1001()
        workfiles.rem_tmpfiles_create_outfile()

