registerSettingsPage(({ settings, settingsStorage }) => {
  let currentLists = JSON.parse(settings.lists || "[]");

  return (
    <Page>
      <Section
        title={
          <Text bold align='center'>
            Lists
          </Text>
        }
      >
        <AdditiveList
          title='A list with Autocomplete'
          settingsKey='lists'
          renderItem={({ name }) => (
            <Section>
              <TextImageRow label={name} />
            </Section>
          )}
          addAction={
            <TextInput
              title='Add List Item'
              label='Item Name'
              placeholder='Type something'
              action='Add Item'
            />
          }
          onListChange={(value) => {
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
              settingsStorage.setItem(
                "selection",
                JSON.stringify({
                  values: [{}],
                  selected: [0],
                })
              );
            }
          }}
        />
      </Section>
      <Section
        title={
          <Text bold align='center'>
            Select a list to edit
          </Text>
        }
      >
        <Select
          label={`Select a list to edit`}
          settingsKey='selection'
          options={JSON.parse(settings.lists || "[]")}
        />
      </Section>

      <Section
        title={
          <Text bold align='center'>
            List items
          </Text>
        }
      >
        <AdditiveList
          title='List Items'
          settingsKey={
            settings.selection
              ? JSON.parse(settings.selection).values[0].name
              : "undefined"
          }
          onListChange={(value) => {
            const selection = JSON.parse(settings.selection);
            console.log(selection?.values[0].name, "selection?.values[0].name");
            setTimeout(async () => {
              try {
                const a = value;
                const lastItem = a[a.length - 1];

                if (lastItem?.name?.match(/,|\[ \]|\[x\]/)) {
                  const splitItems = lastItem.name.split(/,|\[ \]|\[x\]/);
                  const newItems = splitItems.map((item) => ({
                    name: item.trim(),
                  }));

                  settingsStorage.setItem(
                    selection?.values[0].name,
                    JSON.stringify([...a.slice(0, -1), ...newItems])
                  );
                }
              } catch (e) {
                console.log(e);
              }
            }, 1000);
          }}
          renderItem={({ name, value }) => (
            <Section>
              <TextImageRow label={name} sublabel={value} />
            </Section>
          )}
          addAction={
            <TextInput
              title='Add List Item'
              label='Item Name'
              placeholder='Type something'
              action='Add Item'
              disabled={true}
            />
          }
        />
      </Section>
    </Page>
  );
});
