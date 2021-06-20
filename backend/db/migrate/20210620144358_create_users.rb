class CreateUsers < ActiveRecord::Migration[6.1]
  def change
    create_table :users do |t|
      t.string :email, null: false
      t.string :password_digest
      t.integer :token_version, default: 0

      t.timestamps
    end
    add_index :users, :email, unique: true
  end
end
