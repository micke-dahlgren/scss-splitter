import re

filepath='./testData/eventModal.js'
scssRefs = []

def get_SCSS_filename(line):
  scssFile = line;
  while (scssFile.count('/') != 0):
    scssFile = re.sub(r'^.*?/', '', scssFile)
    
  return scssFile.replace("'","").strip()

def get_SCSS_ref_name(line):
  result = re.search('import (.*) from', line)
  return (result.group(1))

def get_SCSS_imports_from_JS_file(filepath):
  jsFile = open(filepath, 'r')
  Lines = jsFile.readlines()
  scssDict =	{}

  for line in Lines:
    lineIsScssImport = re.search("scss", line)
    
    if lineIsScssImport:
      scssFile = get_SCSS_filename(line)
      scssRef = get_SCSS_ref_name(line)
      scssDict[scssRef] = scssFile
      scssRefs.append(scssRef)
    
    for ref in scssRefs:
      lineContainsScssRef = re.search(ref, line)
      if (lineContainsScssRef):
        className = line;
        className = className[className.find(ref):]
        className = className.split(ref + '[' + "\'")
        
        if (len(className) > 1):
          className = className[1].split("\'", 1)
          print(ref +' : ' +className[0])

  return scssDict

scssDict = get_SCSS_imports_from_JS_file(filepath)


print(scssDict[scssRefs[1]])