import os
import shutil
import glob
import subprocess

word_list = ''
dictionary = ''
tmp = '../tmp'
out = '../out'
inputdir = '../../input'
outputdir = '../../output'

def rem_tmpfiles():
    files = [f for f in glob.glob(tmp + f'**/{word_list}-{dictionary}.tmp*', recursive=True)]
    if len(files) > 0:
        os.system(f'rm {tmp}/{word_list}-{dictionary}.tmp*')
    
def rem_tmpfiles_create_outfile():
    cnt = get_last_tmpcnt()
    if cnt == 0:
        raise Exception("tmp files doesn't exist")
    shutil.copyfile(f'{tmp}/{word_list}-{dictionary}.tmp{cnt}',f'{out}/{word_list}-{dictionary}.out.csv')
    os.system(f'rm {tmp}/{word_list}-{dictionary}.tmp*')

def new_tmpfile():
    cnt=get_last_tmpcnt()
    cnt=cnt+1
    out_file = open(f'{tmp}/{word_list}-{dictionary}.tmp{cnt}', 'w')
    out_file.close()
    return cnt

def get_last_tmpcnt():
    files = glob.glob(f'{tmp}/{word_list}-{dictionary}.tmp*')
    return len(files)

def read_inputfile():
    return open(f'{inputdir}/{word_list}.csv', 'r')

def read_outputfile():
    return open(f'{outputdir}/{word_list}-{dictionary}.csv', 'r')

def read_lasttmp_or_output():
    cnt = get_last_tmpcnt()
    if cnt == 0:
        return open(f'{outputdir}/{word_list}-{dictionary}.csv', 'r')
    else:
        return open(f'{tmp}/{word_list}-{dictionary}.tmp{cnt}', 'r')

def get_content_tmp_output():
    rd = read_lasttmp_or_output()
    content = rd.read()
    rd.close()
    return content

def write_tmpfile(cnt, line, oper):
    with open(f'{tmp}/{word_list}-{dictionary}.tmp{cnt}', oper) as the_file:
        the_file.write(line)

def validate_number_tabs(ntabs):
    print(f'validating number of tabs: {ntabs}')
    tmp = read_lasttmp_or_output()
    rows = 0
    valid = True
    while True:
        line = tmp.readline()
        rows+=1
        if not line :
            break
        if line == '\n':
            continue
        if line.count('\t') != ntabs :
            word = line[:line.find('\t')]
            print(red('different number of tabs:'+str(line.count('\t'))+'-'+word))
            print(line)
            return False
    tmp.close()
    print(blue('number of tabs ok'))
    return valid

def count_words():
    content = get_content_tmp_output()
    length = len(content.split('\n'))
    if length < 1000:
        print(red(f'file with less than 1000 words : {length}'))
    elif length > 1000:
        print(red(f'file with more than 1000 words : {length}'))
    return length

def treat_line1001():
    print('verifying the last line if it is 1001 and empty')
    cnt = get_last_tmpcnt()
    if cnt == 0:
        raise('tmp file not found')
    if count_words() == 1001:
        rem_line1001()

def rem_line1001():
    print('removing the line 1001')
    rd = read_lasttmp_or_output()
    cnt = new_tmpfile()
    rows = 0
    while True:
        rows+=1
        line = rd.readline()
        if not line :
            break
        if rows==1000:
            line=line.replace('\n','')
        write_tmpfile(cnt,line,'a')
    rd.close()

def add_word_to_firstfield(cnt):
    print('adding the word to the first field')
    tmpfile = f'{tmp}/{word_list}-{dictionary}.tmp{cnt}'
    inputfile = f'{inputdir}/{word_list}.csv'
    outputfile = f'{outputdir}/{word_list}-{dictionary}.csv'
    os.system(f'paste {inputfile} {outputfile} > {tmpfile}')

def remove_last_comma():
    print('removing the last comma')
    rd = read_lasttmp_or_output()
    cnt = new_tmpfile()
    while True:
        line = rd.readline()
        if not line :
            break
        if line.endswith(',\n'):
            line = line[:-2]+'\n'
        if line.endswith(','):
            line = line[:-1]
        write_tmpfile(cnt,line,'a')
    rd.close()

def add_wordlist_dictionary_soundmp3(sound_field):
    if sound_field.startswith('[sound:'):
        return sound_field[0:7] + word_list +'/'+ dictionary +'/'+ sound_field[7:]
    else:
        return sound_field

def red(text):
    return colored(255, 0, 0, text)

def blue(text):
    return colored(0, 200, 0, text)

def colored(r, g, b, text):
    return "\033[38;2;{};{};{}m{} \033[38;2;255;255;255m".format(r, g, b, text)