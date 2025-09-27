import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    lineHeight: 1.5,
    fontFamily: 'Helvetica',
  },
  title: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    textDecoration: 'underline',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    marginVertical: 4,
  },
  filledField: {
    textDecoration: 'underline',
    fontWeight: 'medium',
  },
  section: {
    marginVertical: 10,
  },
  signature: {
    marginTop: 30,
  },
});

const ConfirmationFormPDF = ({ schoolName, schoolAddress, studentCount, staffCount }) => {
  const renderField = (label, value) => (
    <Text style={styles.text}>
      {label}
      {value ? (
        <Text style={styles.filledField}> {value}</Text>
      ) : (
        ' ____________________'
      )}
    </Text>
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        <Text style={styles.title}>Confirmation Form</Text>
        <Text style={styles.subtitle}>
          Awareness Activity and Mock Drills on Hostile Attack Preparedness
        </Text>

        <View>
          {renderField('1. School Name:', schoolName)}
          {renderField('2. School Address (with Pin Code):', schoolAddress)}
          {renderField('3. Date of Activity:', null)}
          <Text style={styles.text}>4. Total Number of Participants:</Text>
          <Text style={styles.text}>
             Students - Total:
            {studentCount?.total ? <Text style={styles.filledField}> {studentCount.total}</Text> : ' ___'}
            , Female:
            {studentCount?.female ? <Text style={styles.filledField}> {studentCount.female}</Text> : ' ___'}
            , Male:
            {studentCount?.male ? <Text style={styles.filledField}> {studentCount.male}</Text> : ' ___'}
          </Text>

          <Text style={styles.text}>
             Staff - Total:
            {staffCount?.total ? <Text style={styles.filledField}> {staffCount.total}</Text> : ' ___'}
            , Female:
            {staffCount?.female ? <Text style={styles.filledField}> {staffCount.female}</Text> : ' ___'}
            , Male:
            {staffCount?.male ? <Text style={styles.filledField}> {staffCount.male}</Text> : ' ___'}
          </Text>
        </View>


        <Text style={[styles.text, styles.section]}>
          We confirm that the activity was successfully conducted in our school, and the above details are accurate.
        </Text>



        <View style={styles.signature}>


          <Text>Signature of Principal/In-Charge</Text>
          {renderField('Name:', null)}
          {renderField('Designation:', null)}
          {renderField('Date:', null)}
        </View>
      </Page>
    </Document>
  );
};

export default ConfirmationFormPDF;
