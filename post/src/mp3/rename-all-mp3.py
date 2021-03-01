import workfiles
import os
from os import listdir
from os.path import isfile, join

thesau = '/home/element/Documents/english/anki-files/mostcommon-40000/mp3'
pupper = '/home/element/tutorials/puppeteer/mp3'

def rename_all(word_list,dictionary,pathx):
    path = pathx+'/'+word_list+'/'+dictionary
    if os.path.isdir(path):
        onlyfiles = [f for f in listdir(path) if isfile(join(path, f))]
        for f in onlyfiles:
            new_file = f.replace(word_list+'-','')
            print(f'{path}/{f}',f'{path}/{new_file}')
            os.rename(f'{path}/{f}',f'{path}/{new_file}')

ini = 1
end = 1000
for i in range(1,42):
    ini=ini+1000
    end=end+1000
    word_list = str(ini)+'-'+str(end)
    rename_all(word_list, 'cambridge',pupper)
    rename_all(word_list, 'howjsay',pupper)
    rename_all(word_list, 'thesaurus',thesau)