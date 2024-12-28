import { ThemedText, type ThemedTextProps } from "./ThemedText";

interface Props extends ThemedTextProps {
	texts: (string | JSX.Element)[];
}

export default function DotSeparatedText(props: Props) {
	return (
		<ThemedText {...props} style={[props.style]}>
			{props.texts.flatMap((element, i) => {
				const arr = [];

				if (i !== 0) {
					arr.push(" • ");
				}
				arr.push(element);

				return arr;
			})}
		</ThemedText>
	);
}
