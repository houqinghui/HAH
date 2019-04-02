#modify
for KEY in $(find . -name "fab*"); do
	echo ${KEY}
	sed -i 's/\("simple", "path": "contract\).*/\1huaweicaliper/g' ${KEY}
done
