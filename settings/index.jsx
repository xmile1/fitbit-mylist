const handleListChange =
  (currentLists, settingsStorage, settings) => (value) => {
    if (value.length > currentLists.length) {
      const lastItemIndex = value.length - 1;
      const lastItem = value[lastItemIndex];
      settingsStorage.setItem(
        "selection",
        JSON.stringify({
          values: [{ name: lastItem.name }],
          selected: [lastItemIndex],
        })
      );
    }
    if (value.length < currentLists.length) {
      currentLists.forEach((item) => {
        const found = value.find((i) => i.name === item.name);
        if (!found) {
          settingsStorage.removeItem(item.name);
        }
      });
      settingsStorage.setItem(
        "selection",
        JSON.stringify({
          values: [{ name: value[0]?.name }],
          selected: [0],
        })
      );
    }
  };

const handleListItemChange = (settingsStorage, settings) => (value) => {
  const selection = JSON.parse(settings.selection);
  setTimeout(async () => {
    const lastItem = value[value.length - 1];

    if (lastItem?.name?.match(/,|\[ \]|\[x\]|- \[ \]|- \[x\]/)) {
      const splitItems = lastItem.name.split(/,|\[ \]|- \[ \]|- \[x\]|\[x\]/);
      const newItems = splitItems.map((item) => ({
        name: item.trim(),
      }));

      settingsStorage.setItem(
        selection?.values[0].name,
        JSON.stringify([
          ...value.slice(0, -1),
          ...newItems.filter((i) => i.name),
        ])
      );
    }
  }, 1000);
};

const getCurrentSelectionName = (settings) => {
  return settings.selection
    ? JSON.parse(settings.selection).values[0].name
    : null;
};

registerSettingsPage(({ settings, settingsStorage }) => {
  let currentLists = JSON.parse(settings.lists || "[]");
  const currentSelectionName = getCurrentSelectionName(settings);

  return (
    <Page>
      <AdditiveList
        title={<Text bold>List Names</Text>}
        settingsKey='lists'
        addAction={
          <TextInput
            title='List Name'
            label='Add a new list name'
            placeholder='Type a list name'
            action='Add the list'
          />
        }
        onListChange={handleListChange(currentLists, settingsStorage, settings)}
      />

      {!!currentLists?.length && (
        <Section title={<Text bold>Manage a list</Text>}>
          <Select
            label={`Click to select a list to manage`}
            settingsKey='selection'
            options={JSON.parse(settings.lists || "[]")}
            selectViewTitle='Select a list to manage'
          />
        </Section>
      )}
      {currentSelectionName && (
        <Section
          title={
            <Text bold>
              List items{" "}
              {currentSelectionName ? `for ${currentSelectionName}` : ""}
            </Text>
          }
          description={
            <Text>
              NOTE: You can paste a list from google keep, Apple notes, etc. For
              new line separated lists(e.g from excel, word etc) convert them
              first into a comma separated list easily here
              https://convert.town/replace-new-lines-with-commas
              (https://bit.ly/3vLT3b6).
            </Text>
          }
        >
          <AdditiveList
            settingsKey={getCurrentSelectionName(settings)}
            onListChange={handleListItemChange(settingsStorage, settings)}
            addAction={
              <TextInput
                label='Add new items'
                placeholder='e.g Milk,Eggs,Bread'
                disabled={!settings.selection}
              />
            }
          />
        </Section>
      )}
      <Section title={<Text bold>Color Scheme</Text>}>
        <Text>Select a color scheme for the watch app.</Text>
        <ColorSelect settingsKey='color' colors={[{ color: "grey" }]} />
      </Section>
    </Page>
  );
});
