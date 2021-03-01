import workfiles

def sound_mp3_directory():
    print('change the reference of sound in mp3 field')
    rd = workfiles.read_lasttmp_or_output()
    cnt = workfiles.new_tmpfile()
    while True:
        line = rd.readline()
        if not line :
            break
        line = line[:-1]
        fields = line.split('\t')
        if len(fields) == 2:
            fields[1] = workfiles.add_wordlist_dictionary_soundmp3(fields[1])
            newline = fields[0]+'\t'+fields[1]+'\n'
        else:
            newline = fields[0]+'\t\n'
        workfiles.write_tmpfile(cnt,newline,'a')
    rd.close()

def remove_wordlist_from_name():
    print('remove wordlist from name')
    rd = workfiles.read_lasttmp_or_output()
    cnt = workfiles.new_tmpfile()
    while True:
        line = rd.readline()
        if not line :
            break
        line = line[:-1]
        fields = line.split('\t')
        if len(fields) == 1:
            newline = fields[0]+'\t\n'
        else:
            fields[1] = fields[1].replace(workfiles.word_list+'-','')
            newline = fields[0]+'\t'+fields[1]+'\n'
        workfiles.write_tmpfile(cnt,newline,'a')
    rd.close()

def initialize(dictionary, word_list):
    workfiles.word_list = word_list
    workfiles.dictionary = dictionary

def start():
    workfiles.rem_tmpfiles()
    #remove_wordlist_from_name()
    sound_mp3_directory()
    workfiles.treat_line1001()
    workfiles.rem_tmpfiles_create_outfile()