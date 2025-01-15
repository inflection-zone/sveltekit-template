<script lang="ts">
 export let labels;
 export let data1;
 export let data2;
 
 console.log(data1);

 </script>

<table>
    <thead class="thead">
      <tr>
        <th class="p-2"></th>

        <th class="p-2">date</th>
        <th class="p-2">scheduled Task</th>
        <th class="p-2">completed Task</th>
      </tr>
    </thead>
    <tbody class="tbody">
      {#each data1 as item, index}
        <tr class="tabledata">
          <td class="">{index + 1}</td>
          <td class="p-2">{item.labels}</td>
          <td class="p-2">{item.scheduled}</td>
          <td class="p-2">{item.completed}</td>
        </tr>
      {/each}
    </tbody>
  </table>