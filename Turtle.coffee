countOfCommands = 0
countOfLines = 0
hidden=false
x=320
y=210
tail=true
directionAngle=90.0
penColor = r:0, g:0, b:0
penWidth=1
vector = x: 0, y: 1
currentAngle = 0
TAU = 2 * Math.PI
UNIT_STEP_DISTANCE = 30
BORDERS = true

dragStart = (e) ->
	e.dataTransfer.setData "text/html", e.target.innerText
	return

onDragOver = (e) ->
	do e.preventDefault
	return

onDrop = (e) ->
	recieveData = e.dataTransfer.getData 'text/html'
	whatToEdit = document.getElementById 'algorithm'
	countOfCommands++
	whatToEdit.innerHTML = whatToEdit.innerHTML  + "<div id=command#{countOfCommands}  onclick='onClick(event,id)'><b> #{recieveData} </b></div>"
	return

onClick = (e,id) ->
	if isNotPressed e
		e.target.innerHTML = addInputBox e
	else
		value = getEnteredValue e
		if neededToBeDeleted value
			deleteCommandFromAlgorithm e, id
		else
			addParameterToCommand e, value
	return

addInputBox = (e) ->
	e.target.innerHTML = e.target.innerHTML + '<input type="text" placeholder="Enter arguments" id="FINDME">'

isNotPressed = (e) ->
	checking = e.target.innerHTML.indexOf '<input'
	checking++
	if checking==0
		return true
	else return false

getEnteredValue = (e) ->
		inputBox = document.getElementById 'FINDME'
		if inputBox.value isnt ""
				inputBox.value
		else '1'

addParameterToCommand = (e,value) ->
	leftBoard = e.target.innerHTML.indexOf '<input'
	e.target.innerHTML = e.target.innerHTML.slice 0, leftBoard
	checking1 = e.target.innerHTML.indexOf '#'
	if checking1 isnt -1
		e.target.innerHTML = e.target.innerHTML.slice 0, checking1
	e.target.innerText = e.target.innerText + '#' + value

neededToBeDeleted = (value) ->
	if value is '0'
		true
	else
		false

deleteCommandFromAlgorithm = (e,id) ->
	algorithm = document.getElementById('algorithm')
	startDelete = algorithm.innerHTML.indexOf ("<div id=\"#{id}\"")
	endDelete = algorithm.innerHTML.indexOf "</div>", startDelete
	algorithm.innerHTML = algorithm.innerHTML.slice(0,startDelete) + algorithm.innerHTML.slice(endDelete+6)
	return

clearGraphicsField = ->
	phield = document.getElementById 'Graphics field'
	phield.innerHTML = '        <svg id="myField" width="640px" height="420px">  
          <rect x="0" y="0" width="640" height="420"
                style="fill:blue;stroke:pink;stroke-width:5;fill-opacity:0.1;stroke-opacity:0.9" />
        </svg>'
	if not hidden
		showTurtle()
	return

performTheAlgorithm = ->
	if not isAnyCommands()
		return
	cycle = document.getElementById("cycle")
	countCycle = +(cycle.value)
	i = 0
	while i isnt countCycle 
		algorithmStack = do readAlgorithmStack
		while isStackNotEmpty(algorithmStack)
			performCommand(takeCommand(algorithmStack))
			if not hidden
				renderTurtle()
			algorithmStack = popCommand(algorithmStack)
		i++
	return

readAlgorithmStack = ->
	algorithm = document.getElementById 'algorithm'	
	algorithm.innerText.slice(23)

isAnyCommands = ->
	algorithm = document.getElementById 'algorithm'	
	if algorithm.innerText.indexOf('!') isnt (algorithm.innerText.length-1)
		return true
	else
		return false

performCommand = (command) ->
	argumentsOfCommand = '0'
	if command.indexOf('#') isnt (-1)
		str = command.slice(0,command.indexOf('#'))
		argumentsOfCommand = command.slice(command.indexOf('#')+1)
	else
		str = command.slice(0)
	switch str
		when 'Rotate' then makeRotate argumentsOfCommand
		when 'Go' then	makeGo argumentsOfCommand
		when 'Pick up/Lower a pen' then	pickUpOrLowerPen()
		when 'Color of pen' then changeColorOfPen argumentsOfCommand
		when 'Pen width' then changePenWidth argumentsOfCommand
		when 'Show/Unshow turtle' then showUnshowTurtle()
		when 'Go to point' then goToPoint argumentsOfCommand

makeRotate = (angle) ->
	if angle is '0'
		currentAngle +=  45/360
	else
  		currentAngle += (+angle / 360)
  	currentAngle = currentAngle%1
  	vector.x = Math.sin(TAU*currentAngle)
  	vector.y = Math.cos(TAU*currentAngle)
  	vector

makeGo = (argumentsOfCommand) -> 
	if argumentsOfCommand is '0'
		steps =  1
	else
		steps = (+argumentsOfCommand)
	countOfLines++
	newPath = makePath(countOfLines,steps)
	addPathInSVG(newPath)

pickUpOrLowerPen = ->
	if tail is true
		tail=false
	else
		tail = true;

changeColorOfPen = (argumentsOfCommand) ->
	if argumentsOfCommand is '0'
		argumentsOfCommand = '000'
	penColor.r = argumentsOfCommand[0] * 100
	penColor.g = argumentsOfCommand[1] * 100
	penColor.b = argumentsOfCommand[2] * 100

changePenWidth = (argumentsOfCommand) ->
	if argumentsOfCommand is '0'
		argumentsOfCommand =  '1'
	penWidth = (+argumentsOfCommand)

showUnshowTurtle = ->
	if hidden
		hidden = false
		showTurtle()
	else
		hidden = true
		hideTurtle()

renderTurtle = ->
	newX = 10 * vector.x + x
	newY = 10 * vector.y + y
	field = document.getElementById("Graphics field")
	startPoint = field.innerHTML.indexOf('<circle id="turtleChest"')
	if tail
		colorChest = 'green'
		widthNarration = '4'
	else
		colorChest = 'seagreen'
		widthNarration = '1'
	field.innerHTML = field.innerHTML.slice(0,startPoint) + " <circle id='turtleChest' cx='#{x}' cy='#{y}' r='10' stroke='black' stroke-width='2' fill='#{colorChest}' /> 
	<path id='turtleNarration' d='M #{x} #{y} L #{newX} #{newY} ' stroke='rgb(0,0,0)' stroke-width='#{widthNarration}' fill='none'></path> </svg>"

showTurtle = ->
	newX = 10 * vector.x + x
	newY = 10 * vector.y + y
	field = document.getElementById("Graphics field")
	startPoint = field.innerHTML.indexOf('</svg>') - 1
	if tail
		colorChest = 'green'
		widthNarration = '4'
	else
		colorChest = 'seagreen'
		widthNarration = '1'
	field.innerHTML = field.innerHTML.slice(0,startPoint) + " <circle id='turtleChest' cx='#{x}' cy='#{y}' r='10' stroke='black' stroke-width='2' fill='#{colorChest}' /> 
	<path id='turtleNarration' d='M #{x} #{y} L #{newX} #{newY} ' stroke='rgb(0,0,0)' stroke-width='#{widthNarration}' fill='none'></path> </svg>"

hideTurtle = ->
	field = document.getElementById("Graphics field")
	startPoint = field.innerHTML.indexOf('<circle id="turtleChest"')
	field.innerHTML = field.innerHTML.slice(0,startPoint) + " </svg>"		

goToPoint = (argumentsOfCommand) ->	
	if argumentsOfCommand is '0'
		x = 320
		y = 210
	newX = +(argumentsOfCommand.slice(0,argumentsOfCommand.indexOf('.')))
	newY = +(argumentsOfCommand.slice(argumentsOfCommand.indexOf('.')+1))
	if BORDERS
		newX = checkX(newX)
		newY = checkY(newY)
	if tail
		countOfLines++
		newPath = makePathByPoints(countOfLines,newX,newY)
		addPathInSVG(newPath)
	x=newX
	y=newY
	return

checkX = (newX) ->
	if newX>640
		return 640
	else
		if newX<0
			return 0

	newX

checkY = (newY) ->
	if newY>420
		return 420
	else
		if newY<0
			return 0
	return newY

takeCommand = (algorithmStack) ->
	index = algorithmStack.indexOf('\n')
	if index is (-1)
		algorithmStack
	else
		algorithmStack.slice(0, index)

popCommand = (algorithmStack)->
	index = algorithmStack.indexOf('\n')
	if index is (-1)
		algorithmStack = ""
	else
		algorithmStack.slice(index+1)

isStackNotEmpty = (algorithmStack) ->
	if algorithmStack.length is 0
		return false
	else 
		return true

makePath = (lineId,steps) ->
	d = "M #{x} #{y} "
	if tail is true
 		d += "L "
  else
  	d += "M "
  newX = UNIT_STEP_DISTANCE* steps * vector.x + x
  newY = UNIT_STEP_DISTANCE* steps * vector.y + y
  if BORDERS
  	newX = checkX(newX)
		newY = checkY(newY)
	d += (newX) + " " + (newY) + " "

	x = newX
	y = newY

	PATH="<path id='line#{lineId}' d='#{d}' stroke='rgb(#{penColor.r},#{penColor.g},#{penColor.b})' stroke-width='#{penWidth}' fill='none' /> "

makePathByPoints = (lineId,newX, newY) ->
	d = "M #{x} #{y} "
	d += "L "
	if BORDERS
		newX = checkX(newX)
		newY = checkY(newY)
	d += (newX) + " " + (newY) + " "
	x = newX
	y = newY
	PATH="<path id='line#{lineId}' d='#{d}' stroke='rgb(#{penColor.r},#{penColor.g},#{penColor.b})' stroke-width='#{penWidth}' fill='none' /> "
	
addPathInSVG = (newPath) ->
	svgField = document.getElementById("Graphics field")
	if hidden
		startPoint = svgField.innerHTML.indexOf("</svg>") - 1
		adderString = ("</svg>")
	else
		startPoint = svgField.innerHTML.indexOf('<circle id="turtleChest"')
		adderString = svgField.innerHTML.slice(startPoint)
	svgField.innerHTML = svgField.innerHTML.slice(0, startPoint) + newPath + adderString

