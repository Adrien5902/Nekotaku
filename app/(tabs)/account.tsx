import { useAnilistUserInfo } from "@/components/AnilistUserInfoProvider";
import BannerTitleDisplay from "@/components/BannerTitleDisplay";
import MenuItemLink from "@/components/MenuItemLink";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Spacing } from "@/constants/Sizes";
import { useThemeColors } from "@/hooks/useThemeColor";

export default function Account() {
	return (
		<ThemedView style={{ paddingTop: Spacing.xl, flex: 1 }}>
			<AccountInfo />
			<MenuItemLink
				iconLeft={"folder-open"}
				name="Downloaded Episodes"
				route={"/downloaded-episodes"}
			/>
			<MenuItemLink iconLeft={"gear"} name="Settings" route={"/settings"} />
		</ThemedView>
	);
}

function AccountInfo() {
	const user = useAnilistUserInfo();
	const colors = useThemeColors();
	return (
		<ThemedView style={{ marginBottom: Spacing.l }}>
			<BannerTitleDisplay
				text={
					<>
						<ThemedText size="m" weight="bold">
							{user?.name}
						</ThemedText>
						<ThemedText size="s" style={{ opacity: 0.7 }}>
							{user?.about}
						</ThemedText>
					</>
				}
				bannerSource={{ uri: user?.bannerImage ?? undefined }}
				avatarSource={{ uri: user?.avatar?.medium ?? undefined }}
				avatarAspectRatio={1}
				avatarStyle={{
					backgroundColor: `${colors.secondary}aa`,
				}}
			/>
		</ThemedView>
	);
}
