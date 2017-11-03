@echo off

SET ENVS=gdml
rem SET ENVS=102 102t 105 106 106t 109 109t 908 908t 909 909t 960 960t
echo %ENVS%
FOR /D %%p IN (%ENVS%) DO (
	echo Buildo %%p
	node_modules\.bin\ng build --aot true --bh /gipi-ui/ --target=production --environment=%%p -op dist/dist%%p
	)
echo fine
pause