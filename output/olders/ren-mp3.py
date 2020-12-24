import os
 
path = r"./mp3"
directories = os.listdir( path )

for file in directories:
    if file.find(' .mp3') > 0 :
        oldname = file
        newname = oldname.replace(' .mp3','.mp3')
        os.rename(oldname,newname)
        print(newname)