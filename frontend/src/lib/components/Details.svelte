<script>
    import {
      Row,
      Col,
      Table,
    } from 'sveltestrap';

    import { principal, firstName } from '$lib/shared/stores/auth.js';
    let principalValue;
    principal.subscribe( value => principalValue = value);

  /**
   * @param {Number} file Contains the metadata of a file
   * @param {String} file.name File name
   */
    export let file = {};
  </script>

<Row>
  <Col class="col-md-6">
    <Table borderless>
      <tbody>
        <tr>
          <th scope="row">File Name</th>
          <td>{file.name}</td>
        </tr>
        <tr>
          
          <th scope="row">Owner</th>
          <td>
          You
          </td>
        </tr>
      </tbody>
    </Table>

  </Col>
</Row>